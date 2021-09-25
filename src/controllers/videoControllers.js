import Video from "../models/Video";

/*
Video.find({}, (error, videos) => { // 중괄호는 search terms를 나타내고, 비어있으면 모든 형식을 찾는 의미를 가진다. callback으로는 err와 docs를 가지므로, err와 docs를 수신하는 함수가 생김
});
*/

export const home = async(req, res) =>{
    const videos = await Video.find({}).sort({createdAt: "desc"});
    return res.render("home", { pageTitle: "Home", videos });
    };
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(video) {
        return res.render("watch", {pageTitle: video.title, video});
    }
    return res.render("404", {pageTitle: "Video not found"});
}
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video not found"});
    }
    return res.render("edit", {pageTitle: `Edit ${video.title}`, video});
}
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id: id});
    await Video.findByIdAndUpdate(id, {title, description, hashtags: Video.formatHashtags(hashtags)});
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video not found"});
    }
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
    await Video.create({
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
    } catch(error) {
        return res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error._message});
    }
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {$regex: new RegExp(`${keyword}$`, "i")},  // i의 역할은 대소문자 구분을 없앰
        });
        console.log(videos);
    }
    return res.render("search", {pageTitle: "Search", videos});
}