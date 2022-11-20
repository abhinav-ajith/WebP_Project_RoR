class VenuesController < ApplicationController
  before_action :set_venue, only: %i[ show update destroy ]

  # GET /venues
  def index
    @venues = Venue.all
    render json: (@venues)
  end
end
