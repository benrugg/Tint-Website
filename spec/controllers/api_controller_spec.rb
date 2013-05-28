require 'spec_helper'

describe ApiController do
  
  describe "GET 'create_random_gradient'" do
    
    it "returns http success" do
      get 'create_random_gradient', test: "true"
      response.should be_success
    end
    
    it "renders a test page" do
      get 'create_random_gradient', test: "true"
      response.should render_template "create_random_gradient"
    end
    
    it "creates 160 colors with key colors" do
      get 'create_random_gradient', test: "true"
      gradient = assigns(:gradient)
      
      gradient.should have(160).items
      gradient[0].should match(/^[0-9a-f]{6}$/i)
      gradient[20].should match(/^[0-9a-f]{6}\*$/i)
    end
    
    it "creates a color string for the arduino" do
      get 'create_random_gradient', test: "true"
      assigns(:color_string).should match(%r{^/c/\?([a-f0-9]{6}\*?,?){160}.$}i)
    end
    
    it "creates a color string with 2, 3, or 4 key colors" do
      get 'create_random_gradient', test: "true"
      assigns(:color_string).should match(/(\*.*){2,4}/)
    end
    
  end
end