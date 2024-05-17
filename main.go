package main

import (
	src "Sgrid/server/SubServer/Seckill99Server/server"
	h "Sgrid/src/http"
	"Sgrid/src/public"
	"fmt"
)

func main() {
	ctx := h.NewSgridServerCtx(
		h.WithSgridServerType(public.PROTOCOL_HTTP),
		h.WithSgridGinStatic([2]string{"/web", "dist"}),
		h.WithCors(),
	)

	ctx.RegistryHttpRouter(src.SeckillRouter)

	h.NewSgridServer(ctx, func(port string) {
		ctx.Engine.Run(port)
		fmt.Println("Server started on " + port)
	})
}
