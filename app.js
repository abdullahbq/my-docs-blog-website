const express = require('express');
const fs = require('fs');
const path = require('path');
const markdown = require('markdown-it')();

const app = express();

app.set('view engine', 'ejs');
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const getMarkdownFiles = (folder) => {
    return fs.readdirSync(folder).filter(file => path.extname(file) === '.md');
};

// Routes
app.get('/', (req, res) => {
    res.render('pages/home');
});

app.get('/documentation', (req, res) => {
    const docs = getMarkdownFiles(path.join(__dirname, 'contents/docs'));
    res.render('pages/documentation', { docs });
});

app.get('/documentation/:doc', (req, res) => {
    const docs = getMarkdownFiles(path.join(__dirname, 'contents/docs')); // Get the list of docs
    const docPath = path.join(__dirname, 'contents/docs', `${req.params.doc}.md`);

    if (fs.existsSync(docPath)) {
        const content = markdown.render(fs.readFileSync(docPath, 'utf8'));
        res.render('templates/doc_content', { title: req.params.doc, content, docs }); // Pass `docs` to the template
    } else {
        res.status(404).send('Document not found');
    }
});

app.get('/blog', (req, res) => {
    const posts = getMarkdownFiles(path.join(__dirname, 'contents/blog'));
    res.render('pages/blog', { posts });
});

app.get('/blog/:post', (req, res) => {
    const postPath = path.join(__dirname, 'contents/blog', `${req.params.post}.md`);
    const content = markdown.render(fs.readFileSync(postPath, 'utf8'));
    res.render('templates/blog_post', { title: req.params.post, content });
});

app.get('/about', (req, res) => {
    res.render('pages/about');
});

app.get('/contact', (req, res) => {
    res.render('pages/contact');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
