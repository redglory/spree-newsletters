Deface::Override.new(:virtual_path => "spree/layouts/admin",
                     :name => "add_newsletters_tab_to_admin_sidebar",
                     :insert_bottom => "[data-hook='admin_tabs']",
                     :partial => "spree/admin/shared/newsletter_tab",
                     :disabled => false)

