class CreateSpreeNewsletterCopies < ActiveRecord::Migration
  def self.up
    create_table :spree_newsletter_copies do |t|
      t.references :newsletter
      t.string :title
      t.text :body
      t.boolean :show_title
      t.boolean :small_text
    end
    add_index :spree_newsletter_copies, :newsletter_id
  end
  
  def self.down
    drop_table :spree_newsletter_copies
  end
end
