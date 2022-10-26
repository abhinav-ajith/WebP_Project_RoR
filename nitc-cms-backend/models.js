const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const Student = sequelize.define(
		"Student",
		{
			name: { type: DataTypes.STRING },
			password: { type: DataTypes.STRING },
			roll_number: { type: DataTypes.STRING, primaryKey: true },
			email: { type: DataTypes.STRING },
		},
		{ createdAt: false, updatedAt: false }
	);

	const Member = sequelize.define(
		"Member",
		{
			position: { type: DataTypes.STRING },
		},
		{ createdAt: false, updatedAt: false }
	);

	const Club = sequelize.define(
		"Club",
		{
			club_name: { type: DataTypes.STRING, primaryKey: true },
			password: { type: DataTypes.STRING },
			club_desc: { type: DataTypes.STRING },
		},
		{ createdAt: false, updatedAt: false }
	);

	const Participation = sequelize.define(
		"Participation",
		{},
		{ createdAt: false, updatedAt: false }
	);

	const Event = sequelize.define(
		"Event",
		{
			event_id: { type: DataTypes.INTEGER, primaryKey: true },
			event_name: { type: DataTypes.STRING },
			event_desc: { type: DataTypes.STRING },
			max_limit: { type: DataTypes.INTEGER },
		},
		{ createdAt: false, updatedAt: false }
	);

	const Booking = sequelize.define(
		"Booking",
		{
			booking_id: { type: DataTypes.INTEGER, primaryKey: true },
			slot: { type: DataTypes.STRING },
			date: { type: DataTypes.DATE },
		},
		{ createdAt: false, updatedAt: false }
	);

	const Venue = sequelize.define(
		"Venue",
		{
			venue_name: { type: DataTypes.STRING, primaryKey: true },
		},
		{ createdAt: false, updatedAt: false }
	);

	const SysAdmin = sequelize.define(
		"SysAdmin",
		{
			admin_username: { type: DataTypes.STRING, primaryKey: true },
			admin_password: { type: DataTypes.STRING },
		},
		{ createdAt: false, updatedAt: false }
	);

	Student.belongsToMany(Club, {
		through: "Member",
		foreignKey: "member_roll_number",
		otherKey: "club",
	});
	Event.belongsTo(Club, { foreignKey: "event_club" });
	Student.belongsToMany(Event, {
		through: "Participation",
		foreignKey: "participation_roll",
		otherKey: "participation_event",
	});
	Event.belongsTo(Booking, { foreignKey: "event_booking_id" });
	Booking.belongsTo(Venue, { foreignKey: "booking_venue_name" });

	sequelize.sync();
	return { Student, Member, Club, Participation, Event, SysAdmin, Venue, Booking };
};
