class CreateVenues < ActiveRecord::Migration[7.0]
  def change
    create_table :venues do |t|
      t.string :venue_name

      t.timestamps
    end
  end
end
