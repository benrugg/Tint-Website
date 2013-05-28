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
    num_buffer_colors = 20
    num_usable_colors = num_colors - (num_buffer_colors * 2)
    num_random_colors = @random.rand < 0.66 ? 2 : (@random.rand < 0.66 ? 3 : 4)
    num_gradient_parts = num_random_colors - 1
    num_steps_in_gradient_part = num_usable_colors / num_gradient_parts
    
    
    # generate the random colors
    key_colors = Array.new(num_random_colors) { self::generate_random_color }
    
    
    # use the key colors to make a full gradient with all color steps (adding an
    # asterisk to all the key color values except the last one)
    gradient_colors = []
    
    num_gradient_parts.times do |i|
      
      color1 = key_colors[i]
      color2 = key_colors[i + 1]
      
      num_steps_in_gradient_part.times do |j|
        
        gradient_colors << ColorMath::Blend.alpha(color1, color2, j / num_steps_in_gradient_part.to_f).hex[1..6] + (j == 0 ? "*" : "")
        
      end
      
    end
    
    
    # add an asterisk to the last key color value
    gradient_colors[num_usable_colors - 1] += "*"
    
    
    # buffer the beginning (getting rid of the asterisk)
    first_color = gradient_colors[0][0..5]
    num_buffer_colors.times { gradient_colors.unshift first_color }
    
    
    # buffer the ending (getting rid of the asterisk)
    last_color = gradient_colors[gradient_colors.length - 1][0..5]
    num_buffer_colors.times { gradient_colors.push last_color }
    
    
    # return the full gradient
    gradient_colors
    
  end
  
  
  def persisted?
    false
  end
end
