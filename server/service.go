package src

import (
	h "Sgrid/src/http"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	redis "github.com/go-redis/redis/v8"
)

const (
	rds_key_info     = "rds_key_info|"
	rds_key_count    = "rds_key_count|"
	rds_history_hash = "rds_history_hash"
)

// 节点每次单例访问
var localHash = make(map[string]SeckillInfo)

func SeckillRouter(ctx *h.SgridServerCtx) {
	InitStorage(ctx.SgridConf)
	rg := ctx.Engine.Group("/seckill99server/")
	rg.POST("/seckill", seckill)
	rg.POST("/setSeckillKey", setSeckillInfo)
	rg.GET("/getSeckillList", getSeckillList)
}

type SeckillInfo struct {
	SeckillHashKey     string `json:"hashKey"`
	ColudBuyTime       string `json:"couldBuyTime"`
	SeckillCount       int    `json:"seckillCount"`
	SeckillDescription string `json:"seckillDescription"`
}

func (m *SeckillInfo) MarshalBinary() (data []byte, err error) {
	return json.Marshal(m)
}

func (m *SeckillInfo) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, m)
}

type SeckillReq struct {
	SeckillHashKey string `json:"hashKey"`
	UserHash       string `json:"userHash"`
	UserByTime     string `json:"userBuyTime"`
}

func (m *SeckillReq) MarshalBinary() (data []byte, err error) {
	return json.Marshal(m)
}

func (m *SeckillReq) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, m)
}

func seckill(c *gin.Context) {
	var req *SeckillReq

	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if req.SeckillHashKey == "" || req.UserHash == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "hashKey or userHash is empty",
		})
		return
	}
	info := fmt.Sprintf("%v%v", rds_key_info, req.SeckillHashKey)
	s, has := localHash[info]
	if !has {
		var get_info *SeckillInfo
		if errString := GRDB.Get(RDBContext, info).Scan(&get_info).Error(); errString != "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "RDBContext Get Error " + info,
			})
			return
		}
		localHash[info] = *get_info
		s = *get_info
	}

	now := time.Now()

	// 添加错误处理
	could, err := time.ParseDuration(s.ColudBuyTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid could_buy_time format",
		})
		return
	}
	could_but_time := time.Time{}.Add(could)
	b := now.Before(could_but_time)
	if b {
		c.JSON(http.StatusOK, gin.H{
			"error": "没到活动时间",
		})
		return
	}
	count := fmt.Sprintf("%v%v", rds_key_info, req.SeckillHashKey)
	GRDB.DecrBy(RDBContext, count, 1)
	c.AbortWithStatus(http.StatusOK)
}

func setSeckillInfo(c *gin.Context) {
	var req *SeckillInfo
	err := c.BindJSON(&req)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	fmt.Println("setSeckillInfo req", req)
	info := fmt.Sprintf("%v%v", rds_key_info, req.SeckillHashKey)
	count := fmt.Sprintf("%v%v", rds_key_count, req.SeckillHashKey)

	GRDB.Set(RDBContext, info, req, 0)
	GRDB.Set(RDBContext, count, req.SeckillCount, 0)

	fmt.Println("info", info)
	fmt.Println("count", count)

	GRDB.ZAdd(
		RDBContext,
		rds_history_hash,
		&redis.Z{
			Score:  float64(time.Now().Unix()),
			Member: req.SeckillHashKey,
		},
	)
	c.AbortWithStatus(http.StatusOK)
}

func getSeckillList(c *gin.Context) {
	vals := GRDB.ZRangeByScoreWithScores(
		RDBContext,
		rds_history_hash,
		&redis.ZRangeBy{
			Min: "-inf",
			Max: "+inf",
		}).Val()
	var respList = make([]SeckillInfo, 0)
	for _, v := range vals {
		fmt.Println("v", v)
		info := fmt.Sprintf("%v%v", rds_key_info, v.Member)
		fmt.Println("info", info)
		result := &SeckillInfo{}
		GRDB.Get(RDBContext, info).Scan(result)
		if result.SeckillHashKey != "" {
			// layout := "2006-01-02T15:04:05.000Z"
			// d, err := time.Parse(layout, result.ColudBuyTime)
			// if err != nil {
			// 	fmt.Println("Parse Error" + err.Error())
			// }
			// if time.Now().Format(time.DateOnly) == d.Format(time.DateOnly) {
			respList = append(respList, *result)
			// }
		}
	}
	c.AbortWithStatusJSON(http.StatusOK, respList)
}
