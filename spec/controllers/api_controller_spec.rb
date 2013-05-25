require 'spec_helper'

describe ApiController do
  
  describe "GET 'create_random_gradient'" do
    
    it "returns http success" do
      get 'create_random_gradient'
      response.should be_success
    end
    
    it "creates 160 colors" do
      get 'create_random_gradient'
      assigns(:gradient).should have(160).items
    end
  end
  
end
