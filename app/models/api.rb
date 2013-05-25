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
    
    num_colors = 160
    
    color1 = self::generate_random_color
    color2 = self::generate_random_color
    
    num_colors.times.map { |i| ColorMath::Blend.alpha(color1, color2, i / num_colors.to_f).hex }
    
  end
  
  
  def persisted?
    false
  end
end
