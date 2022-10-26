const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Student = sequelize.define("Student", {
		name: { type: DataTypes.STRING },
		roll_number: { type: DataTypes.STRING, primaryKey: true },
		email: { type: DataTypes.STRING },
	});
	Student.hasMany(Club);
	Student.hasOne(Member);
	Student.hasMany(Event);

	const Member = sequelize.define(
		"Member",
		{
			position: { type: DataTypes.STRING },
		},
		{ createdAt: false, updatedAt: false }
	);
	Member.belongsTo(Club, { foreignKey: "club" });
	Member.belongsTo(Student, { foreignKey: "member_roll_no" });

	const Club = sequelize.define(
		"Club",
		{
			club_name: { type: DataTypes.STRING, primaryKey: true },
			password: { type: DataTypes.STRING },
			club_desc: { type: DataTypes.STRING },
		},
		{ createdAt: false, updatedAt: false }
	);
	Club.hasMany(Student);
	Club.hasMany(Event);

	const Participation = sequelize.define("Participation", { createdAt: false, updatedAt: false });
	Participation.hasOne(Student, { foreignKey: "participation_roll" });
	Participation.hasOne(Event, { foreignKey: "participation_event" });

	const Event = sequelize.define("Event", {
		event_id: { type: DataTypes.INTEGER, primaryKey: true },
		event_name: { type: DataTypes.STRING },
		event_desc: { type: DataTypes.STRING },
		max_limit: { type: DataTypes.INTEGER },
	});
	Event.hasMany(Participation);
	Event.hasOne(Club, { foreignKey: "event_club" });
	Event.hasOne(Booking, { foreignKey: "event_booking_id" });

	Booking.hasOne(Event);

	sequelize.sync({ alter: true });
	return { Student };
};
