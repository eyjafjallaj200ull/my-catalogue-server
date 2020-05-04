const bookshelfCall = require("../../services/bookshelf-call")

const bookshelfController = (req, res) => {
    bookshelfCall(req.query.bookshelfId, req.session.id)
    .then(data => {
      if (data){
      console.log("hi", data);
      if(data.items) {
        const books = data.items;
        return res.json(books)
      } else {
        return res.json([]);
      } 
      } 
      else{
        //if accessToken expires
        return res.status(401).json()
      }
    })
    .catch(err => console.log(err))
  }

module.exports = bookshelfController