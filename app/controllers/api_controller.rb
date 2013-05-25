require 'colormath'

class ApiController < ApplicationController
  
  def create_random_gradient
    
    num_colors = 160
    
    color1 = self::generate_random_color
    color2 = self::generate_random_color
    
    @gradient = num_colors.times.map { |i| ColorMath::Blend.alpha(color1, color2, i / num_colors.to_f).hex }
    
    #render json: gradient
    
    #@colors = 20.times.map { self::generate_random_color }
    
    #render :json => self::generate_random_color
    
  end
  
  def generate_random_color
    
    @random = @random || Random.new
    
    hue = @random.rand 360
    saturation = @random.rand 0.8..1.0
    lightness = @random.rand 0.4..0.6
    
    new_color = ColorMath::HSL.new hue, saturation, lightness
    
  end
end