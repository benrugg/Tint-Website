require 'spec_helper'

describe Api do
  
  describe "should have predictable randomness" do
    
    it "generates predictable random colors when seeded" do
      
      api = Api.new 999999
      
      api.generate_random_color().hex.should eq("#2bf981")
      api.generate_random_color().hex.should eq("#25e9a1")
      api.generate_random_color().hex.should eq("#2484ec")
      
    end
  end
  
  
  describe "should have real randomness" do
    
    before(:all) do
      
      @api = Api.new
      
    end
    
    it "generates random colors" do
      
      random_color_hex = @api.generate_random_color().hex
      random_color_hex.should match(/^#[0-9a-f]{6}$/i)
      
    end
    
    it "creates a random gradient with 160 colors" do
      
      gradient_colors = @api.create_random_gradient
      
      gradient_colors.should have(160).items
      gradient_colors[1].should match(/^[0-9a-f]{6}$/i)
      
    end
    
    it "buffers the first and last 20 colors" do
      
      gradient_colors = @api.create_random_gradient
      
      gradient_colors[0].should eq gradient_colors[1]
      gradient_colors[1].should eq gradient_colors[2]
      gradient_colors[2].should eq gradient_colors[19]
      
      gradient_colors[140].should eq gradient_colors[141]
      gradient_colors[141].should eq gradient_colors[142]
      gradient_colors[142].should eq gradient_colors[159]
      
      gradient_colors[20].should match(/^[0-9a-f]{6}\*$/i)
      gradient_colors[139].should match(/^[0-9a-f]{6}\*$/i)
      
    end
  end
end
