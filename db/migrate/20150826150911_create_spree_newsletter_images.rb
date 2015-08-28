class CreateSpreeNewsletterImages < ActiveRecord::Migration
  def change
    create_table :spree_newsletter_images do |t|
      t.references :newsletter
      t.string :name
      t.string :href
      t.string :newsletter_image_file_name
      t.string :newsletter_image_content_type
      t.integer :newsletter_image_file_size
      t.datetime :newsletter_image_updated_at
      
    end
    add_index :spree_newsletter_images, :newsletter_id
  end
end
