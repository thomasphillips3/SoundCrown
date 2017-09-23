Rails.application.routes.draw do

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :show], param: :username do
      resources :tracks, only: [:index]
    end
    resource :session, only: [:create, :destroy]
    resources :tracks, only: [:index, :show, :create, :destroy]
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "static_pages#root"
end
