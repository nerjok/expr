const mongoose = require("mongoose");
const User = mongoose.model("User");
const Advertisement = mongoose.model("Advertisement");
const { body, validationResult } = require("express-validator");
const { deletePhotos } = require('../helpers/advertisements');

const pagOptions = {
  page: 1,
  limit: 3,
  customLabels: {
    docs: 'advertisements'
  }
};


const validate = method => {
  switch (method) {
    case "createAdvertisement": {
      return [
        body("title", "Invalid title").isLength({ min: 10, max: 100 }),
        body("description", "Invalid description")
          .exists()
          .isLength({ min: 50, max: 1000 }),
        body("skills")
          .exists()
          .isLength({ min: 5, max: 500 }),
        body("tools")
          .optional()
          .isLength({ min: 10, max: 500 }),
        body("time")
          .optional()
          .isLength({ min: 10, max: 500 }),
        body("payment")
          .optional()
          .isLength({ min: 10, max: 500 }),
        body("status").optional()
        //.isIn(["enabled", "disabled"])
      ];
    }
  }
};

const showAdvertisements = async (req, res) => {
  var page = req.query.page || 0;
  page++;
  const limit = 5;
  const skip = page * limit;
  const advertisements = await Advertisement.paginate({}, {
    ...pagOptions,
    page,
    skip,
    limit,
    sort: { '_id': -1 }
  }).then(advertisements => {
    res.send({ ...advertisements, total: Math.ceil(advertisements.totalDocs / limit) });

  })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      res.send({ advertisements: [], total: Math.ceil(advertisements.totalDocs / limit) });
    });
};



const myAdvertisements = async (req, res) => {
  var page = req.query.page || 0;
  const limit = 5;
  const skip = page * limit;

  const usr = await User.findById(req.user._id)
    .populate({
      path: 'advertisements',
      options: {
        skip,
        limit,
        sort: { '_id': -1 }
      },
    })
    .populate('advertisementsCount');

  if (!usr || !usr.advertisements) {
    res.send({ advertisements: [] });
    return;
  }
  const ads = { advertisements: usr.advertisements, total: Math.ceil(usr.advertisementsCount / limit), page };

  res.send(ads);
};

const createAdvertisement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }

  const { title, description, skills, tools, time, dateTime, location, status, workType, city } = req.body;

  let resp = await Advertisement.create({
    title,
    description,
    _user: req.user,
    skills,
    tools,
    time,
    dateTime,
    status,
    workType,
    city,
    location: {
      type: "Point",
      coordinates: location
    }
  });

  if (!resp._id) {
    res.send({ errors: [{ msg: "Advertisement not saved" }] });
    return;
  }

  res.send(resp);
};

const updateAdvertisement = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }

  const { title, description, skills, tools, payment, time, dateTime, location, status, workType, city } = req.body;

  const resp = await Advertisement.findOneAndUpdate(
    { _id: req.params.id, _user: req.user._id },
    {
      title,
      description,
      skills,
      tools,
      payment,
      time,
      dateTime,
      status,
      workType,
      city,
      location: {
        type: "Point",
        coordinates: location
      }
    },
    { new: true }
  );
  res.send(resp);
};

async function getAdvertisements(user, page = 0) {
  const limit = 5;
  const skip = page * limit;
  const usr = await User.findById(user._id)
    .populate({
      path: "advertisements",
      options: {
        skip,
        limit,
        sort: { _id: -1 }
      }
    })
    .populate("advertisementsCount");

  if (!usr || !usr.advertisements) return [];

  const ads = {
    page,
    advertisements: usr.advertisements,
    total: Math.ceil(usr.advertisementsCount / limit)
  };

  return ads;
}

const showAdvertisement = async (req, res) => {
  const advertisement = await Advertisement.findOne({
    _id: req.params.id
  }).populate("_user");

  res.send(advertisement);
};

const uploadPhoto = async (req, res) => {
  if (req.files && !req.fileValidationError) {
    const advertisement = await Advertisement.findOne({
      _id: req.params.id
    }).populate("_user");

    return res.send(advertisement);
  }
  res.send({ msg: 'error uploading photos', error: 'upload error' });
};

const deletePhoto = async (req, res) => {

  deletePhotos(req.params.id, req.params.photo);

  const advertisement = await Advertisement.findOne({
    _id: req.params.id
  }).populate("_user");

  res.send(advertisement);
};

const deleteAdvertisement = async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;

  await Advertisement.deleteById(id);
  const advertisements = await getAdvertisements(req.user, page);
  res.send(advertisements);
};

const filterAdvertisements = async (req, res) => {

  const { lat, lng, distance, keyword, status, workType } = req.query;
  const page = req.query.page || 0;
  const limit = 5;


  /** With pagination */
  const page2 = +page + 1;

  const searchObj = {};
  if (lat && lng && distance) {
    searchObj.location = {
      $geoWithin: { $centerSphere: [[lat, lng], distance / 6371.1] }
    };
  }
  if (keyword) {
    searchObj.$or = [
      { description: { $regex: '.*' + keyword + '.*' } },
      { title: { $regex: '.*' + keyword + '.*' } }
    ];
  }

  if (status)
    searchObj.status = status;
  if (workType)
    searchObj.workType = workType;

  const advertisementsF = await Advertisement.paginate(
    searchObj
    , {
      ...pagOptions,
      page: page2,
      skip: 4,
      limit,
      sort: { '_id': -1 }
    });

  res.send({ ...advertisementsF, total: Math.ceil(advertisementsF.totalDocs / limit) });
};

module.exports = {
  validate,
  createAdvertisement,
  updateAdvertisement,
  showAdvertisement,
  showAdvertisements,
  deleteAdvertisement,
  deletePhoto,
  uploadPhoto,
  filterAdvertisements,
  myAdvertisements
};
