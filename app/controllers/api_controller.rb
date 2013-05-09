require 'colormath'

class ApiController < ApplicationController
  
  def choose_random_color
    
    @test = ColorMath::HSL.new(60, 1, 0.5)
    
    #render :nothing => true
    
  end
end
