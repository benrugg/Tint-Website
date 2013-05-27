require 'spec_helper'

describe Api do
  
  it "generates predictable random colors when seeded" do
    
    api = Api.new 999999
    
    api.generate_random_color().hex.should eq("#2bf981")
    api.generate_random_color().hex.should eq("#25e9a1")
    api.generate_random_color().hex.should eq("#2484ec")
    
  end
  
  it "generates random colors" do
    
    api = Api.new
    
    random_color_hex = api.generate_random_color().hex
    random_color_hex.should match(/^#[0-9a-f]{6}$/i)
    
  end
  
  it "creates a random gradient with 160 colors" do
    
    api = Api.new
    
    gradient_colors = api.create_random_gradient
    
    gradient_colors.should have(160).items
    gradient_colors[0].should match(/^[0-9a-f]{6}\*$/i)
    gradient_colors[1].should match(/^[0-9a-f]{6}$/i)
    
  end
  
end
