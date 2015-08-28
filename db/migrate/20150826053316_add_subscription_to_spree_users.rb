class AddSubscriptionToSpreeUsers < ActiveRecord::Migration
  def self.up
    add_column :spree_users, :first_name, :string
    add_column :spree_users, :last_name, :string
    add_column :spree_users, :locale, :string, :null => false, :default => 'pt-PT'
    add_column :spree_users, :state, :string
    add_column :spree_users, :postcode, :integer, :length => 4
    add_column :spree_users, :subscribed, :boolean
    add_column :spree_users, :email_errors, :integer, :length => 2, :null => false, :default => 0
    add_column :spree_users, :email_sent, :integer, :null => false, :default => 0
    add_column :spree_users, :email_views, :integer, :null => false, :default => 0
    add_column :spree_users, :email_clicks, :integer, :null => false, :default => 0
  end

  def self.down
    remove_column :spree_users, :first_name
    remove_column :spree_users, :last_name
    remove_column :spree_users, :locale
    remove_column :spree_users, :state
    remove_column :spree_users, :postcode
    remove_column :spree_users, :subscribed
    remove_column :spree_users, :email_errors
    remove_column :spree_users, :email_sent
    remove_column :spree_users, :email_views
    remove_column :spree_users, :email_clicks
  end
end
