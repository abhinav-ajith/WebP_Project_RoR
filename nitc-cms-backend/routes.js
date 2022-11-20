const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jwt-simple");
const secret = "secret";
const sequelize = require("./db");
const { Student, Member, Club, Participation, Event, Booking, Venue, SysAdmin } = sequelize.models;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("You shouldnt be here");
});

// Accepts student details and adds student to students database, returns access token
router.post("/register", async (req, res) => {
  const { name, roll_no, email, password, confirm_password } = req.body;
  const hashed_password = crypto.createHash("sha256").update(password).digest("hex");

  const student = await Student.findByPk(roll_no);
  console.log(student);
  if (student === null) {
    if (password === confirm_password) {
      await Student.create({
        name: name,
        roll_number: roll_no,
        email: email,
        password: hashed_password,
      }).catch((err) => {
        res.json({ message: "Database Error:" + err });
      });

      return res.json({
        access_token: jwt.encode({ roll_no: roll_no }, secret),
      });
    } else {
      return res.json({ message: "Passwords don't match" });
    }
  } else {
    res.send({ message: "Roll number already exists" });
  }
});

//  login handling
router.post("/login/student", async (req, res) => {
  const roll_no = req.body.roll_no;
  const password = req.body.password;

  if (!roll_no || !password) return res.json({ msg: "One or more fields are empty." });

  const user = await Student.findByPk(roll_no);
  if (user !== null && crypto.createHash("sha256").update(password).digest("hex") == user.password) {
    return res.json({
      access_token: jwt.encode({ roll_no: roll_no }, secret),
    });
  } else {
    return res.json({ message: "Incorrect roll number or password" });
  }
});

router.post("/login/ca", async (req, res) => {
  const club_name = req.body.club_name;
  const password = req.body.password;

  if (!club_name || !password) return res.json({ msg: "One or more fields are empty." });

  const user = await Club.findByPk(club_name);
  if (user !== null && crypto.createHash("sha256").update(password).digest("hex") === user.password) {
    return res.json({
      access_token: jwt.encode({ club_name: club_name }, secret),
    });
  } else {
    return res.json({ message: "Incorrect club name or password" });
  }
});

router.post("/login/sa", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) return res.json({ msg: "One or more fields are empty." });

  const user = await SysAdmin.findByPk(username);
  console.log(user);
  if (user !== null && crypto.createHash("sha256").update(password).digest("hex") == user.admin_password) {
    return res.json({
      access_token: jwt.encode({ admin_username: username }, secret),
    });
  } else {
    return res.json({ message: "Incorrect username  or password" });
  }
});

// login end

// Accepts event details, enters event into event db and booking in booking db, returns event id
router.post("/event_add", async (req, res) => {
  let club_name;
  try {
    club_name = jwt.decode(req.headers.authorization, secret).club_name;
    if (!club_name) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }
  const { event_name, event_desc, event_venue, max_limit, slot, date } = req.body;

  const eventDate = new Date(date);

  const booking = await Booking.findOne({
    where: { date: eventDate, slot, booking_venue_name: event_venue },
  });
  if (booking == null) {
    const booking = await Booking.create({
      slot,
      date: eventDate,
      booking_venue_name: event_venue,
    });
    const event = await Event.create({
      event_name,
      event_club: club_name,
      event_desc,
      max_limit,
      event_booking_id: booking.booking_id,
    });
    return res.json({ event_id: event.event_id });
  } else {
    return res.json({ message: "slot unavailable" });
  }
});

// Accepts new event details if any, and returns the event id
router.post("/event_edit", async (req, res) => {
  let club_name;
  try {
    club_name = jwt.decode(req.headers.authorization, secret).club_name;
    if (!club_name) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }
  const { event_id, event_name, event_desc, event_venue, max_limit, slot, date } = req.body;
  const event = await Event.findByPk(event_id);
  const booking = await Booking.findByPk(event.event_booking_id);
  if (event_name) event.event_name = event_name;
  if (event_desc) event.event_desc = event_desc;
  if (max_limit) event.max_limit = max_limit;
  if (slot) booking.slot = slot;
  if (date) booking.date = new Date(date);
  if (event_venue) booking.booking_venue_name = event_venue;
  await event.save();
  await booking.save();
  return res.json({ event_id: event_id });
});

// Accepts events id and returns event details
router.post("/event_view", async (req, res) => {
  const event_id = req.body.event_id;
  let event = await Event.findByPk(event_id);
  const booking = await Booking.findByPk(event.event_booking_id);
  let event_details = event.get({ plain: true });
  event_details["slot"] = booking.slot;
  event_details["date"] = booking.date;
  event_details["venue"] = booking.booking_venue_name;
  return res.json({ event: event_details });
});

router.post("/club_edit", async (req, res) => {
  let club_name;
  try {
    club_name = jwt.decode(req.headers.authorization, secret).club_name;
    if (!club_name) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }
  const club = await Club.findByPk(club_name);
  club.club_desc = req.body.club_desc;
  await club.save();
  return res.json({ msg: "Edited" });
});

//  Add new club members
router.post("/club_member_add", async (req, res) => {
  let club_name;
  try {
    club_name = jwt.decode(req.headers.authorization, secret).club_name;
    if (!club_name) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }
  const { roll_no, position } = req.body;
  const student = await Student.findByPk(roll_no);

  if (student === null) return res.json({ msg: "Invalid roll no" });
  try {
    await Member.create({ member_roll_number: roll_no, club: club_name, position });
  } catch (err) {
    return res.json({ msg: "already a member" });
  }
  return res.json({ msg: "Member added." });
});

router.post("/club_member_delete", async (req, res) => {
  let club_name;
  try {
    club_name = jwt.decode(req.headers.authorization, secret).club_name;
    if (!club_name) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }
  const roll_no = req.body.roll_no;

  const member = await Member.findOne({ where: { member_roll_number: roll_no } });
  await member.destroy();

  return res.json({ msg: "Member deleted." });
});

router.post("/club_add", async (req, res) => {
  let admin_username;
  try {
    admin_username = jwt.decode(req.headers.authorization, secret).admin_username;
    if (!admin_username) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }
  const { club_name, club_desc, password } = req.body;
  const hashed_password = crypto.createHash("sha256").update(password).digest("hex");
  const club = await Club.create({
    club_name,
    club_desc,
    password: hashed_password,
  });
  return res.json({ club: club_name });
});

router.get("/clubs/:club_name", async (req, res) => {
  let club;
  try {
    club = await Club.findByPk(req.params.club_name);
  } catch (err) {
    return res.json({ msg: err.message });
  }
  let result = {};
  result["club_name"] = req.params.club_name;
  result["club_desc"] = club.club_desc;
  const members_rno = await Member.findAll({
    where: { club: req.params.club_name },
  });
  let members = [];
  for (const member of members_rno) {
    let name = (await Student.findByPk(member.member_roll_number)).name;
    members.push({ name: name, position: member.position });
  }
  result["members"] = members;
  const events = (
    await Event.findAll({
      where: { event_club: req.params.club_name },
    })
  ).map((e) => e.get({ plain: true }));

  for (const event of events) {
    let booking = await Booking.findByPk(event.event_booking_id);
    event["slot"] = booking.slot;
    event["date"] = booking.date;
  }
  result["events"] = events;
  return res.json({ info: result });
});

router.get("/club_info", async (req, res) => {
  let club_name;
  try {
    club_name = jwt.decode(req.headers.authorization, secret).club_name;
    if (!club_name) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }
  const club = await Club.findByPk(club_name);
  const result = {};
  result["club_name"] = club_name;
  result["club_desc"] = club.club_desc;
  const members_rno = await Member.findAll({ where: { club: club_name } });
  let members = [];
  for (const member of members_rno) {
    let name = (await Student.findByPk(member.member_roll_number)).name;
    members.push({
      name: name,
      roll_no: member["member_roll_number"],
      position: member["position"],
    });
  }
  result["members"] = members;
  const events = (await Event.findAll({ where: { event_club: club_name } })).map((e) => e.get({ plain: true }));
  for (const event of events) {
    let booking = await Booking.findByPk(event.event_booking_id);
    event["slot"] = booking.slot;
    event["date"] = booking.date;
  }
  result["events"] = events;
  return res.json({ info: result });
});

router.post("/venue_add", async (req, res) => {
  let admin_username;
  try {
    admin_username = jwt.decode(req.headers.authorization, secret).admin_username;
    if (!admin_username) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }
  const venue_name = req.body.venue_name;
  const venue = await Venue.create({ venue_name: venue_name });
  return res.json({ venue: venue_name });
});

// Accepts event id, enters student into participants db, returns confirmation
router.post("/event_register", async (req, res) => {
  let roll_number;
  try {
    roll_number = jwt.decode(req.headers.authorization, secret).roll_no;
    if (!roll_number) return res.json({ message: "jwt validation error" });
  } catch (err) {
    return res.json({ message: err.message });
  }

  const event_id = req.body.event_id;
  const participations = await Participation.findAll({
    where: { participation_roll: roll_number },
  });
  for (const participation of participations) {
    if (event_id == participation.participation_event) return res.json({ msg: "Already registered" });
  }
  const max_limit = (await Event.findByPk(event_id)).max_limit;
  const count = await Participation.count({
    where: { participation_event: event_id },
  });
  if (count >= max_limit) {
    return res.json({ msg: "Max participants reached." });
  }
  try {
    await Participation.create({
      participation_roll: roll_number,
      participation_event: event_id,
    });
  } catch (error) {
    return res.json({ message: "Database Error:" + error });
  }
  return res.json({ msg: "Registered" });
});

router.get("/events_future", async (req, res) => {
  const events = await Event.findAll();
  const future_events = [];
  for (const event of events) {
    let booking = await Booking.findByPk(event.event_booking_id);
    if (new Date(booking.date) > new Date()) {
      future_events.push({
        ...event.get({ plain: true }),
        ...booking.get({ plain: true }),
        venue: booking.booking_venue_name,
        booking_venue_name: undefined,
      });
    }
  }
  return res.json({ events: future_events });
});

router.get("/events_student", async (req, res) => {
  const roll_number = jwt.decode(req.headers.authorization, secret).roll_no;
  const participations = await Participation.findAll({
    where: { participation_roll: roll_number },
  });
  console.log(participations);
  const events = [];
  for (const participation of participations) {
    let event = await Event.findByPk(participation.participation_event);
    let booking = await Booking.findByPk(event.event_booking_id);
    if (booking.date > new Date()) {
      events.push({
        ...event.get({ plain: true }),
        ...booking.get({ plain: true }),
        booking_venue_name: undefined,
        venue: booking.booking_venue_name,
      });
    }
  }

  return res.json({ events: events });
});

router.get("/clubs_all", async (req, res) => {
  const clubs = await Club.findAll();
  if (clubs === null) {
    return res.json({ msg: "No clubs" });
  } else {
    return res.json({ clubs: clubs.map((c) => ({ ...c.get({ plain: true }), password: undefined })) });
  }
});
// router.get("/venues_all", async (req, res) => {
//   const venues = await Venue.findAll();
//   if (venues === null) {
//     return res.json({ msg: "No venues" });
//   } else {
//     return res.json({
//       venues: venues.map((venue) => venue.get({ plain: true })),
//     });
//   }
// });

router.post("/registered_students", async (req, res) => {
  const club_name = jwt.decode(req.headers.authorization, secret);
  const event_id = req.body.event_id;
  let participants = [];
  const participations = await Participation.findAll({
    where: { participation_event: event_id },
  });
  for (const participation of participations) {
    let participant = await Student.findByPk(participation.participation_roll);
    participants.push({
      roll_no: participant.roll_no,
      name: participant.name,
      email: participant.email,
    });
  }
  res.json({ participants: participants });
});

router.get("/student_details", async (req, res) => {
  const roll_number = jwt.decode(req.headers.authorization, secret).roll_no;
  const student = await Student.findByPk(roll_number);
  res.json({ msg: { ...student.get({ plain: true }), password: undefined } });
});

module.exports = router;
