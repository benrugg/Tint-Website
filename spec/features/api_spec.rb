require 'spec_helper'

describe "Api" do
  
  describe "GET /api/create_random_gradient" do
    
    it "creates a random gradient of 160 colors (in test mode)" do
      
      visit "/api/create_random_gradient?test=1"
      
      page.should have_selector "div.test_gradient"
      page.should have_selector "div.test_gradient div", count: 160
      
    end
    
    it "creates a random gradient with real color values (in test mode)", :driver => :selenium do
      
      visit "/api/create_random_gradient?test=1"
      
      all("div.test_gradient div")[2].native.css_value("background-color").should match(/^#[0-9a-f]{6}|rgba\(.*\)$/i)
      
    end
    
  end
end