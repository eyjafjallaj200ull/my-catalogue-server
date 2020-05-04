const GoogleApi = require("../../services/google-api")
const {addVolume, removeVolume} = require("../../services/volume-operations")

exports.fetchVolume = (req, res) => {
    GoogleApi.fetchVolume(req.query.volumeId)
    .then(data => {
      const volumeInfo = data.volumeInfo;
      return res.json(volumeInfo);
    })
    .catch(err => res.status(500).json())
}

exports.addVolume = (req, res) => {
    addVolume(req.body.shelfId, req.body.volumeId, req.session.id)
    .then((response) => {      
      if(response.status == 204){
        res.status(200).json()
      } else {
        //if accessToken expires
        res.status(401).json()
      }
    })
    .catch(err => res.status(500).json())
}

exports.removeVolume = (req, res) => {
    removeVolume(req.body.shelfId, req.body.volumeId, req.session.id)
    .then((response) => {
      if(response.status == 204){
        res.status(200).json()
      } else {
        //if accessToken expires
        res.status(401).json()
      }
    })
    .catch(err => res.status(500).json())
  }