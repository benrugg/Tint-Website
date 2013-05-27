require 'spec_helper'

describe ApiController do
  
  describe "GET 'create_random_gradient'" do
    
    it "returns http success" do
      get 'create_random_gradient', test: true
      response.should be_success
    end
    
    it "creates 160 colors with key colors" do
      get 'create_random_gradient', test: true
      gradient = assigns(:gradient)
      
      gradient.should have(160).items
      gradient[0].should match(/^#[0-9a-f]{6}\*$/i)
      gradient[1].should match(/^#[0-9a-f]{6}$/i)
    end
    
    it "should render a test page" do
      get 'create_random_gradient', test: true
      
      response.should render_template "create_random_gradient"
    end
  end
  
end