package src

import (
	"Sgrid/src/config"
	"context"
	"fmt"
	"time"

	redis "github.com/go-redis/redis/v8"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var GORM *gorm.DB
var GRDB *redis.Client
var RDBContext = context.Background()

func InitStorage(ctx *config.SgridConf) {
	db_master := ctx.GetString("db_master")
	redis_addr := ctx.GetString("redis-addr")
	redis_pass := ctx.GetString("redis-pass")
	db, err := gorm.Open(mysql.Open(db_master), &gorm.Config{
		SkipDefaultTransaction: true,
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "seckill",
			SingularTable: true,
		},
	})
	if err != nil {
		fmt.Println("Error To init gorm", err)
	}
	sqlDB, err := db.DB()
	if err != nil {
		fmt.Println("Error To init db.DB", err)
	}
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	GORM = db
	GRDB = redis.NewClient(&redis.Options{
		Addr:     redis_addr,
		Password: redis_pass,
		DB:       0,
	})
	pong, err := GRDB.Ping(RDBContext).Result()
	if err != nil {
		fmt.Printf("连接redis出错，错误信息：%v", err.Error())
	} else {
		fmt.Println("成功连接redis", pong)
	}

}
