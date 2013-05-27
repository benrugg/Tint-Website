class ApiController < ApplicationController
  
  def create_random_gradient
    
    # create a random gradient
    api = Api.new
    @gradient = api.create_random_gradient
    
    
    # reverse the gradient (because the rgb wall is mounted facing away from the viewer)
    @gradient.reverse!
    
    
    # join the values to create a long string
    @color_string = "/c/?" + @gradient.join(",") + "."
    
    
    
    # if we want to test this method, render the gradient in the view
    if [1, "1", true, "true", "y", "yes"].include? params[:test] then
      
      # render the view
      
      
    # else, send the gradient to the arduino
    else
      
      response = RestClient.get(ARDUINO_URL + @color_string)
      
      render json: {gradient: @gradient.join(","), result: response.to_str}
      
    end
    
  end
end