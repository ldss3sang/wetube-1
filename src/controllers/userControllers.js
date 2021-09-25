import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if(password !== password2) {
        return res.status(400).render("join", {pageTitle, errorMessage: "Password confirmation does not match."});
    }
    const exists = await User.exists({ $or: [{username}, {email}] });
    if(exists){
        return res.status(400).render("join", {pageTitle, errorMessage: "This username/email is already taken."});
    }
    try {
        await User.create({
            name, username, email, password, location
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {pageTitle: "Join", errorMessage: error._message})
    }
};
export const edit = (req, res) => res.send("Edit user");
export const remove = (req, res) => res.send("Remove user");
export const getLogin = (req, res) => res.render("login", {pageTitle: "Login"});
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username});
    if(!user) {
        return res.status(400).render("login", {pageTitle, errorMessage: "An account with this username does not exists"});
    }
    const ok = await bcrypt.compare(password, user.password);   // 첫 번째 인자 password는 유저가 입력한 password, 두 번째는 암호화 된 password(데이터베이스에 저장된 해시값 비밀번호)
    if(!ok) {
        return res.status(400).render("login", {pageTitle, errorMessage: "wrong password"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        clientId: process.env.GH_CLIENT,
        allow_singup: false,
        scope: "read:user user:email",  // read:user 공백 user:email로 주소 작성이 가능
    };
    const params = new URLSearchParams(config).toString();  // config 안에 있는 오브젝트 값들이 전부 url 형식으로 합쳐져서 나옴
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id:process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const data = await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        }
    })
    const json = await data.json();
    console.log(json);
    res.send(JSON.stringify(json));
}

export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");