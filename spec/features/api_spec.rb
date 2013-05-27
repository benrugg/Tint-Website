require 'spec_helper'

describe "Api" do
  
  describe "GET /api/create_random_gradient" do
    
    it "creates a random gradient (in test mode)" do
      
      visit "/api/create_random_gradient?test=1"
      
      page.should have_selector "div.test_gradient"
      page.should have_selector "div.test_gradient div", count: 160
      
    end
    
  end
end