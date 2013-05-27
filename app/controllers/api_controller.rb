class ApiController < ApplicationController
  
  def create_random_gradient
    
    # create a random gradient
    api = Api.new
    @gradient = api.create_random_gradient
    
    
    # if we want to test this method, render the gradient in the view
    if params[:test] then
      
      # render the view
      
      
    # else, send the gradient to the arduino
    else
      
      # reverse the gradient (because the rgb wall is mounted facing away from the viewer)
      @gradient.reverse!
      
      render text: "not test"
      
    end
    
    
    #render json: gradient
    
    #@colors = 20.times.map { self::generate_random_color }
    
    #render :json => self::generate_random_color
    
  end
  
end