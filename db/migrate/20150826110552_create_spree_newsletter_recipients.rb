class CreateSpreeNewsletterRecipients < ActiveRecord::Migration
  def self.up
    create_table :spree_newsletter_recipients do |t|
      t.references :country
      t.references :state
      t.string :name
      t.string :email
      t.timestamps
    end
    add_index :spree_newsletter_recipients, :email
    add_index :spree_newsletter_recipients, :country_id
    add_index :spree_newsletter_recipients, :state_id
  end

  def self.down
    drop_table :spree_newsletter_recipients
  end
end
