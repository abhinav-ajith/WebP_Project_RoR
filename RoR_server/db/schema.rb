# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_11_17_154102) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "Bookings", primary_key: "booking_id", id: :serial, force: :cascade do |t|
    t.string "slot", limit: 255
    t.timestamptz "date"
    t.string "booking_venue_name", limit: 255
  end

  create_table "Clubs", primary_key: "club_name", id: { type: :string, limit: 255 }, force: :cascade do |t|
    t.string "password", limit: 255
    t.string "club_desc", limit: 255
  end

  create_table "Events", primary_key: "event_id", id: :serial, force: :cascade do |t|
    t.string "event_name", limit: 255
    t.string "event_desc", limit: 255
    t.integer "max_limit"
    t.string "event_club", limit: 255
    t.integer "event_booking_id"
  end

  create_table "Members", primary_key: ["member_roll_number", "club"], force: :cascade do |t|
    t.string "position", limit: 255
    t.string "member_roll_number", limit: 255, null: false
    t.string "club", limit: 255, null: false
  end

  create_table "Participations", primary_key: ["participation_roll", "participation_event"], force: :cascade do |t|
    t.string "participation_roll", limit: 255, null: false
    t.integer "participation_event", null: false
  end

  create_table "Students", primary_key: "roll_number", id: { type: :string, limit: 255 }, force: :cascade do |t|
    t.string "name", limit: 255
    t.string "password", limit: 255
    t.string "email", limit: 255
  end

  create_table "SysAdmins", primary_key: "admin_username", id: { type: :string, limit: 255 }, force: :cascade do |t|
    t.string "admin_password", limit: 255
  end

  create_table "Venues", primary_key: "venue_name", id: { type: :string, limit: 255 }, force: :cascade do |t|
  end

  create_table "venues", force: :cascade do |t|
    t.string "venue_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "Bookings", "\"Venues\"", column: "booking_venue_name", primary_key: "venue_name", name: "Bookings_booking_venue_name_fkey", on_update: :cascade, on_delete: :nullify
  add_foreign_key "Events", "\"Bookings\"", column: "event_booking_id", primary_key: "booking_id", name: "Events_event_booking_id_fkey", on_update: :cascade, on_delete: :nullify
  add_foreign_key "Events", "\"Clubs\"", column: "event_club", primary_key: "club_name", name: "Events_event_club_fkey", on_update: :cascade, on_delete: :nullify
  add_foreign_key "Members", "\"Clubs\"", column: "club", primary_key: "club_name", name: "Members_club_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "Members", "\"Students\"", column: "member_roll_number", primary_key: "roll_number", name: "Members_member_roll_number_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "Participations", "\"Events\"", column: "participation_event", primary_key: "event_id", name: "Participations_participation_event_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "Participations", "\"Students\"", column: "participation_roll", primary_key: "roll_number", name: "Participations_participation_roll_fkey", on_update: :cascade, on_delete: :cascade
end
