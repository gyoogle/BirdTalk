const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// fs 모듈은 이미지를 업로드할 uploads 폴더가 없을 때 uploads 폴더를 생성함
fs.readdir('uploads', (error) => {
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});

// storage : 파일 저장 방식, 경로, 파일명 등 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); // 날짜를 붙이는 건 중복 막기 위해
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024}, // 최대 허용치
});

// 이미지 업로드를 처리하는 라우터
// single 미들웨어를 사용했고, 앱에서 ajax로 이미지를 보낼때 속성이름을 img로 설정함
// 이미지 처리 후 req.file 객체에 결과를 저장함
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
});


// 게시글 업로드를 처리하는 라우터
// 이미지를 업로드했으면, 이미지 주소도 req.body.url로 전송됨
// 이미지 데이터를 직접 가져오는 것이 아니라 url을 가져오므로 none() 메소드를 사용한 상태
// 게시글을 db에 저장한 후, 내용에서 해시태그를 정규표현식으로 추출해냄
// 추출한 해시태그를 db에 저장한 후, addHashtags 메소드로 게시글과 해시태그 관계를 PostHashtag 테이블에 넣음
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase()},
            })));
            await post.addHashtags(result.map( r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await Post.destroy({ where: { id: req.params.id, userId: req.user.id }});
        res.send('OK');
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
      return res.redirect('/');
    }
    try {
      const hashtag = await Hashtag.findOne({ where: { title: query } });
      let posts = [];
      if (hashtag) {
        posts = await hashtag.getPosts({ include: [{ model: User }] });
      }
      return res.render('main', {
        title: `${query} | NodeBird`,
        user: req.user,
        twits: posts,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
});

router.post('/:id/like', async (req, res, next) => {
    try{
        const post = await Post.findOne({ where: {id: req.params.id }});
        await post.addLiker(req.user.id);
        res.send('OK');
    }catch(error) {
        console.error(error);
        return next(error);
    }
});

router.delete('/:id/like', async (req, res, next) => {
    try{
        const post = await Post.findOne({ where: {id: req.params.id }});
        await post.removeLiker(req.user.id);
        res.send('OK');
    }catch(error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;