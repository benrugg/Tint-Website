class Api
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming
  
  
  def initialize(random_seed = Random.new_seed)
    
    @random = Random.new random_seed
    
  end
  
  
  def generate_random_color
    
    hue = @random.rand 360
    saturation = @random.rand 0.8..1.0
    lightness = @random.rand 0.4..0.6
    
    ColorMath::HSL.new hue, saturation, lightness
    
  end
  
  
  def create_random_gradient
    
    # initialize variables and randomly (with some weighting) choose how many
    # colors we want in our gradient
    num_colors = 160
    num_random_colors = @random.rand < 0.66 ? 2 : (@random.rand < 0.66 ? 3 : 4)
    num_gradient_parts = num_random_colors - 1
    num_steps_in_gradient_part = num_colors / num_gradient_parts
    
    
    # generate the random colors
    key_colors = Array.new(num_random_colors) { self::generate_random_color }
    
    
    # use the key colors to make a full gradient with all color steps (adding an
    # asterisk to all the key color values except the last one)
    gradient_colors = []
    
    num_gradient_parts.times do |i|
      
      color1 = key_colors[i]
      color2 = key_colors[i + 1]
      
      num_steps_in_gradient_part.times do |j|
        
        gradient_colors << ColorMath::Blend.alpha(color1, color2, j / num_steps_in_gradient_part.to_f).hex + (j == 0 ? "*" : "")
        
      end
      
    end
    
    
    # if we have one less color than we need, duplicate the last one (this would
    # happen if we have 4 key colors, because we would have only made 53 steps
    # in each gradient part, for a total of 159)
    if gradient_colors.length == 159 then gradient_colors[159] = gradient_colors[158] end
    
    
    # add an asterisk to the last key color value
    gradient_colors[159] += "*"
    
    
    # return the full gradient
    gradient_colors
    
  end
  
  
  def persisted?
    false
  end
end
