const GoogleApi = require("../../services/google-api")
const {addVolume, removeVolume} = require("../../services/volume-operations")

exports.fetchVolume = (req, res) => {
    GoogleApi.fetchVolume(req.query.volumeId)
    .then(data => {
      const volumeInfo = data.volumeInfo;
      return res.json(volumeInfo);
    }) //catch here
}

exports.addVolume = (req, res) => {
    addVolume(req.body.shelfId, req.body.volumeId, req.session.id)
    .then((response) => {
      if(response.code == 204){
        res.status(200).json()
      } else {
        //if accessToken expires
        res.status(401).json()
      }
    }) //catch here
}

exports.removeVolume = (req, res) => {
    removeVolume(req.body.shelfId, req.body.volumeId, req.session.id)
    .then(() => {
      if(response.code == 204){
        res.status(200).json()
      } else {
        //if accessToken expires
        res.status(401).json()
      }
    }) //catch here
  }