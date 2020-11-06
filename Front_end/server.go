package main

import (
	"net/http"
)

func main() {
	estatica := http.FileServer(http.Dir("public"))
	http.Handle("/", http.StripPrefix("/", estatica))
	http.ListenAndServe(":5000",nil)
}

// func pIndex(res http.ResponseWriter, req *http.Request) {
// 	http.ServeFile(res, req, "./index.html")

// }
