import mongoose from "mongoose"; // mongoose는 mongoDB를 연결해주는 다리 역할을 함

mongoose.connect(process.env.DB_URL, {  // 27017 뒤에 오는 /wetube는 데이터베이스 이름
    useNewUrlParser: true,
    useUnifiedTopology: true,   // 현재 다운받은 nodeJS에서는 기본값으로 설정되어 있기 때문에
});                             // 굳이 설정할 필요 없음

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB")
db.on("error", (error) => console.log("DB Error", error));
db.once("open", handleOpen);
//  mongoose.connection.on("error", (error) => console.log("DB Error", error)); 로도 사용가능 db.once도 마찬가지

