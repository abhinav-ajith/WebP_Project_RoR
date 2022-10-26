const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jwt-simple");
const secret = "secret";
const sequelize = require("./db");
const { Student, Member, Club, Participation, Event, Booking, Venue, SysAdmin } = sequelize.models;

/* GET home page. */
router.get("/", function (req, res, next) {
	res.send("hello cliford");
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
router.post("/login/student", (req, res) => {
	res.send("hello cliford");
});

router.post("/login/ca", (req, res) => {
	res.send("hello cliford");
});

router.post("/login/sa", (req, res) => {
	res.send("hello cliford");
});

// login end

// Accepts event details, enters event into event db and booking in booking db, returns event id
router.post("/event_add", async (req, res) => {
	let club_name;
	try {
		club_name = jwt.decode(req.headers.authorization, secret);
	} catch (err) {}
	const { event_name, event_desc, event_venue, max_limit, slot, date } = req.body;

	const eventDate = new Date(date).toISOString().substring(0, 10);

	const booking = Booking.findOne({
		where: { date: eventDate, slot, booking_venue_name: event_venue },
	});
	if (booking == null) {
		const booking = await Booking.create({
			slot,
			date,
			booking_venue_name: event_venue,
		});
		const event = await Event.create({
			event_name,
			event_club: club_name,
			event_desc,
			max_limit,
			event_booking_id: booking.booking_id,
		});
		res.json({ event_id: event.event_id });
	} else {
		res.json({ message: "slot unavailable" });
	}
});

// Accepts new event details if any, and returns the event id
router.post("/event_edit", (req, res) => {
	res.send("hello cliford");
});

// Accepts events id and returns event details
router.post("/event_view", (req, res) => {
	res.send("hello cliford");
});

router.post("/club_edit", (req, res) => {
	res.send("hello cliford");
});

//  Add new club members
router.post("/club_member_add", (req, res) => {
	res.send("hello cliford");
});

router.post("/club_member_delete", (req, res) => {
	res.send("hello cliford");
});

router.post("/club_add", (req, res) => {
	res.send("hello cliford");
});

router.post("/venue_add", (req, res) => {
	res.send("hello cliford");
});

// Accepts event id, enters student into participants db, returns confirmation
router.post("/event_register", (req, res) => {
	console.log(req);
	const roll_number = jwt.decode(req.headers.authorization, secret);
	res.json({ roll_number });
});

router.get("/events_all", (req, res) => {
	res.send("hello cliford");
});

router.get("/events_future", (req, res) => {
	res.send("hello cliford");
});

router.get("/events_student", (req, res) => {
	res.send("hello cliford");
});

router.get("/clubs_all", (req, res) => {
	res.send("hello cliford");
});

router.get("/club_members", (req, res) => {
	res.send("hello cliford");
});

router.get("/club_info", (req, res) => {
	res.send("hello cliford");
});

router.get("/club/:club_name", (req, res) => {
	res.send("hello cliford");
});

router.get("/registered_students", (req, res) => {
	res.send("hello cliford");
});

router.get("/student_details", (req, res) => {
	res.send("hello cliford");
});

module.exports = router;
/*
import datetime

from flask import jsonify, request
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from werkzeug.security import check_password_hash, generate_password_hash

from main import *
from models import (Students, Members, Clubs, Participation, Events, Bookings, Venues, SysAdmin,
                    event_schema, events_schema, clubs_schema, venues_schema, members_schema, student_schema)

from flask_cors import cross_origin

from main import db
db.create_all()

#accepts student details and adds student to students database, returns access token
@app.route('/register', methods=['POST'])
@cross_origin()
def user_register():
    try:
        name = request.json['name']
        roll_no = request.json['roll_no']
        email = request.json['email']
        password = request.json['password']
        hashed_password = generate_password_hash(password, method='sha256')
        confirm_password = request.json['confirm_password']
    except KeyError:
        return jsonify({"msg":"One or more fields are empty."})

    roll_number = Students.query.filter_by(roll_number=roll_no).first()

    if roll_number is None:
        if password == confirm_password:
            new_student = Students(name, hashed_password, roll_no, email)

            db.session.add(new_student)
            db.session.commit()

            access_token = create_access_token(identity=roll_no)
            return jsonify(access_token=access_token)

        else:
            return jsonify({"message": "Passwords don't match"})
    
    else:
        return jsonify({ "message" : "Roll number already exists" })

#accepts login details, and returns access tokens
@app.route("/login/student", methods=["POST"])
@cross_origin()
def stud_login():
    try:
        username = request.json['roll_no']
        password = request.json['password']
    except KeyError:
        return jsonify({"msg":"One or more fields are empty."})

    user = Students.query.filter_by(roll_number=username).first()
    
    if user is not None and check_password_hash( user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "Incorrect roll number or password"})

#accepts login details, returns access token
@app.route("/login/ca", methods=["POST"])
@cross_origin()
def ca_login():
    try:
        username = request.json['club_name']
        password = request.json['password']
    except KeyError:
        return jsonify({"msg":"One or more fields are empty."})

    user = Clubs.query.filter_by(club_name=username).first()
    
    if user is not None and check_password_hash( user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "Incorrect club name or password"})

#accepts login details, returns access token
@app.route("/login/sa", methods=["POST"])
@cross_origin()
def sa_login():
    try:
        username = request.json['username']
        password = request.json['password']
    except KeyError:
        return jsonify({"msg":"One or more fields are empty."})

    user = SysAdmin.query.filter_by(admin_username=username).first()
    print(generate_password_hash('admin', method='sha256'))
    
    if user is not None and check_password_hash( user.admin_password, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "Incorrect username or password"})

#accepts event details, enters event into event db and booking in booking db, returns event id
@app.route("/event_add", methods=['POST'])
@cross_origin()
@jwt_required()
def add_event():
    event_name = request.json['event_name']
    event_club = Clubs.query.filter_by(club_name=get_jwt_identity()).first().club_name
    event_desc = request.json['event_desc']
    event_venue = request.json['event_venue']
    max_limit = request.json['max_limit']
    slot = request.json['slot']
    date = datetime.datetime.strptime(request.json['date'], '%Y-%m-%d')

    bookings = Bookings.query.filter_by(date=date).all()
    for booking in bookings:
        if booking.slot == slot and booking.booking_venue_name == event_venue:
            return ({"msg":"Slot unavailable"})

    booking = Bookings(event_venue, slot, date)
    db.session.add(booking)
    db.session.commit()
    
    event = Events(event_name, event_club, event_desc, max_limit, booking.booking_id)
    db.session.add(event)
    db.session.commit()
    return jsonify({"event_id":f"{event.event_id}"})

#accepts new event details if any, and returns the event id
@app.route("/event_edit", methods=['POST'])
@cross_origin()
@jwt_required()
def edit_event():
    event_id = request.json['event_id']
    event = Events.query.filter_by(event_id=event_id).first()
    booking = Bookings.query.filter_by(booking_id=event.event_booking_id).first()
    if 'event_name' in request.json: event.event_name = request.json['event_name']
    if 'event_desc' in request.json: event.event_desc = request.json['event_desc']
    if 'max_limit' in request.json: event.max_limit = request.json['max_limit']
    if 'slot' in request.json: booking.slot = request.json['slot']
    if 'date' in request.json: booking.date = datetime.datetime.strptime(request.json['date'], '%Y-%m-%d')
    if 'event_venue' in request.json: booking.booking_venue_name = request.json['event_venue']
    db.session.commit()
    return jsonify({"event_id":f"{event.event_id}"})

#accepts events id and returns event details
@app.route("/event_view", methods=['POST'])
@cross_origin()
@jwt_required()
def view_event():
    event_id = request.json['event_id']
    event = Events.query.filter_by(event_id=event_id).first()
    # print(event.event_booking_id)
    booking = Bookings.query.filter_by(booking_id=event.event_booking_id).first()
    slot = booking.slot
    date = booking.date
    event = event_schema.dump(event)
    event['slot'] = slot
    event['date'] = date
    event['venue'] = booking.booking_venue_name
    return jsonify({"event":event})

#accept new club details and return confirmation
@app.route("/club_edit", methods=['POST'])
@cross_origin()
@jwt_required()
def edit_club():
    club_name = request.json['club_name']
    club = Clubs.query.filter_by(club_name=club_name).first()
    club.club_desc = request.json['club_desc']
    db.session.commit()
    return jsonify({"msg":"Edited"})

#accepts member details, enters student into members db, returns confirmation
@app.route("/club_member_add", methods=['POST'])
@cross_origin()
@jwt_required()
def add_member():
    club_name = get_jwt_identity()
    roll_no = request.json['roll_no']
    student = Students.query.filter_by(roll_number=roll_no).first()
    if not student:
        return jsonify({"msg":"Invalid roll no"})
    position=request.json['position']
    member = Members(roll_no, club_name, position)
    db.session.add(member)
    db.session.commit()
    return jsonify({"msg":"Member added."})

#accepts rollnumber, deletes from member db and returns confirmation
@app.route("/club_member_delete", methods=['POST'])
@cross_origin()
@jwt_required()
def delete_member():
    club_name = get_jwt_identity()
    roll_no = request.json['roll_no']

    member = Members.query.filter_by(member_roll_number=roll_no).first()
    db.session.delete(member)
    db.session.commit()
    return jsonify({"msg":"Member deleted."})

#accepts club details, adds clubs to club db, returns confirmation
@app.route("/club_add", methods=['POST'])
@cross_origin()
@jwt_required()
def add_club():
    club_name = request.json['club_name']  
    club_desc = request.json['club_desc']
    password = request.json['password']
    hashed_password = generate_password_hash(password, method='sha256')
    
    club = Clubs(club_name,club_desc,hashed_password)
    db.session.add(club)
    db.session.commit()
    return jsonify({"club":f"{club_name}"})
  
#accepts venue name, enters venue into db, returns confirmation  
@app.route("/venue_add", methods=['POST'])
@cross_origin()
@jwt_required()
def add_venue():
    venue_name = request.json['venue_name']         
    
    venue = Venues(venue_name)
    db.session.add(venue)
    db.session.commit()
    return jsonify({"venue":f"{venue_name}"})
  
#accepts event id, enters student into participants db, returns confirmation  
@app.route("/event_register", methods=['POST'])
@cross_origin()
@jwt_required()
def event_register():
    rollNumber = get_jwt_identity()
    event_id=request.json['event_id']

    participations = Participation.query.filter_by(participation_roll=rollNumber).all()
    for participation in participations:
        if int(event_id) == participation.participation_event:
            return jsonify({"msg":"Already registered"})

    count = Participation.query.filter_by(participation_event=event_id).count()
    max_limit = Events.query.filter_by(event_id=event_id).first().max_limit
    if count >= max_limit:
        return jsonify({"msg":"Max participants reached."})
    
    participant=Participation(rollNumber,event_id)
    db.session.add(participant)
    db.session.commit()    
    return jsonify({"msg":"Registered"})
  
#returns all event details
@app.route("/events_all", methods=['GET'])
@cross_origin()
def events_all():
    events = Events.query.all()
    events = events_schema.dump(events)
    return jsonify({"events":events})
  
#returns all events
@app.route("/events_future", methods=['GET'])
@cross_origin()
def events_future():
    events = Events.query.all()
    future_events = []
    for event in events:
        booking = Bookings.query.filter_by(booking_id=event.event_booking_id).first()
        if booking.date > datetime.datetime.now():
            future_events.append(event)
    future_events = events_schema.dump(future_events)

    for event in future_events:
        booking = Bookings.query.filter_by(booking_id=event['event_booking_id']).first()
        event['slot'] = booking.slot
        event['date'] = booking.date
        event['venue'] = booking.booking_venue_name

    return jsonify({"events":future_events})
  
#return all events
@app.route("/events_student", methods=['GET'])
@cross_origin()
@jwt_required()
def events_student():
    events = []
    roll_no = get_jwt_identity()
    participations = Participation.query.filter_by(participation_roll=roll_no).all()
    for participation in participations:
        event = Events.query.filter_by(event_id=participation.participation_event).first()
        booking = Bookings.query.filter_by(booking_id=event.event_booking_id).first()
        if booking.date > datetime.datetime.now():
            events.append(event)
    events = events_schema.dump(events)

    for event in events:
        booking = Bookings.query.filter_by(booking_id=event['event_booking_id']).first()
        event['slot'] = booking.slot
        event['date'] = booking.date
        event['venue'] = booking.booking_venue_name
    
    return jsonify({"events":events})
  
#returns all club details
@app.route("/clubs_all", methods=['GET'])
@cross_origin()
def clubs_all():
    try:
        clubs = Clubs.query.all()
        clubs = clubs_schema.dump(clubs)
        return jsonify({"clubs":clubs})
    except:
        return jsonify({"msg":"No clubs"})
      
#returns all venues
@app.route("/venues_all", methods=['GET'])
@cross_origin()
@jwt_required()
def venues_all():
    try:
        venues = Venues.query.all()
        venues = venues_schema.dump(venues)
        return jsonify({"venues":venues})
    except:
        return jsonify({"msg":"No venues"})
      
#returns all club members  
@app.route("/club_members", methods=['GET'])
@cross_origin()
@jwt_required()
def club_members():
    club_name= get_jwt_identity()
    members=Members.query.filter_by(club=club_name).all()
    members=members_schema.dump(members)
    result = {}
    for member in members:
        name = Students.query.filter_by(roll_number=member.member_roll_number).first().name
        result['member_roll_number'] = name
    return jsonify({"members":members})

#returns club details
@app.route("/club_info", methods=['GET'])
@cross_origin()
@jwt_required()
def club_info():
    club_name= get_jwt_identity()
    club = Clubs.query.filter_by(club_name=club_name).first()
    events = Events.query.filter_by(event_club=club_name).all()
    result = {}
    result['club_name'] = club_name
    result['club_desc'] = club.club_desc
    members_rno = Members.query.filter_by(club=club_name).all()
    members_rno = members_schema.dump(members_rno)
    members = []
    for member in members_rno:
        print(member)
        name = Students.query.filter_by(roll_number=member['member_roll_number']).first().name
        members.append({"name": name, "roll_no": member['member_roll_number'], "position": member['position']})
    result['members'] = members
    events = Events.query.filter_by(event_club=club_name).all()
    events = events_schema.dump(events)
    for event in events:
        booking = Bookings.query.filter_by(booking_id=event['event_booking_id']).first()
        event['slot'] = booking.slot
        event['date'] = booking.date
    result['events'] = events
    return jsonify({"info":result})

#returns club details
@app.route("/clubs/<club_name>", methods=['GET'])
@cross_origin()
def club_info_student(club_name):
    try:
        club = Clubs.query.filter_by(club_name=club_name).first()
        events = Events.query.filter_by(event_club=club_name).all()
        result = {}
        result['club_name'] = club_name
        result['club_desc'] = club.club_desc
        members_rno = Members.query.filter_by(club=club_name).all()
        members_rno = members_schema.dump(members_rno)
        members = []
        for member in members_rno:
            print(member)
            name = Students.query.filter_by(roll_number=member['member_roll_number']).first().name
            members.append({"name": name, "position": member['position']})
        result['members'] = members
        events = Events.query.filter_by(event_club=club_name).all()
        events = events_schema.dump(events)
        for event in events:
            booking = Bookings.query.filter_by(booking_id=event['event_booking_id']).first()
            event['slot'] = booking.slot
            event['date'] = booking.date
        result['events'] = events
        return jsonify({"info":result})
    except:
        return jsonify({"msg":"No such club"})
      
#accepts event id and returns list of participants
@app.route("/registered_students", methods=['POST'])
@cross_origin()
@jwt_required()
def registered_students():
    club_name= get_jwt_identity()
    event_id = request.json['event_id']
    participants = []
    participations = Participation.query.filter_by(participation_event=event_id).all()
    for participation in participations:
        participant = Students.query.filter_by(roll_number=participation.participation_roll).first()
        participants.append({'roll_no' : participant.roll_number, 'name' : participant.name, 'email': participant.email})
    return jsonify({"participants":participants})
 
#return student details
@app.route('/student_details', methods=['GET'])
@cross_origin()
@jwt_required()
def student_details():
    rollNumber=get_jwt_identity()
    student=Students.query.filter_by(roll_number=rollNumber).first()
    student=student_schema.dump(student)
    return jsonify({"msg":student})
  
  



if __name__ == "__main__":
    app.run(debug=True)

*/
