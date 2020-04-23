const GoogleApi = require("../../services/google-api")
const {addVolume, removeVolume} = require("../../services/volume-operations")

exports.fetchVolume = (req, res) => {
    GoogleApi.fetchVolume(req.query.volumeId)
    .then(data => {
      const volumeInfo = data.volumeInfo;
      return res.json(volumeInfo);
    })
}

exports.addVolume = (req, res) => {
    addVolume(req.body.shelfId, req.body.volumeId, req.session.id)
    .then(() => {
      res.status(200).json()
    })
}

exports.removeVolume = (req, res) => {
    removeVolume(req.body.shelfId, req.body.volumeId, req.session.id)
    .then(() => {
      res.status(200).json()
    })
  }