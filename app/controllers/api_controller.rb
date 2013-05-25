class ApiController < ApplicationController
  
  def create_random_gradient
    
    api = Api.new
    
    @gradient = api.create_random_gradient
    
    #render json: gradient
    
    #@colors = 20.times.map { self::generate_random_color }
    
    #render :json => self::generate_random_color
    
  end
  
end