module SpreeNewsletters
  class Engine < Rails::Engine
    isolate_namespace SpreeNewsletters
    engine_name 'spree_newsletters'

    config.autoload_paths += %W(#{config.root}/lib)
    config.autoload_paths += %W(#{config.root}/app/middleware)

    def self.activate
      Dir.glob(File.join(File.dirname(__FILE__), "../../app/**/*_decorator*.rb")) do |c|
        Rails.configuration.cache_classes ? require(c) : load(c)
      end
      Dir.glob(File.join(File.dirname(__FILE__), "overrides/*.rb")) do |c|
        Rails.application.config.cache_classes ? require(c) : load(c)
      end
    end

    config.to_prepare &method(:activate).to_proc

    initializer "spree_newsletters.env" do |app|
      
      app.config.assets.precompile += ['spree/backend/spree_newsletters.js']
      app.config.assets.precompile += ['spree/backend/spree_newsletters.css']
      
      app.middleware.insert_before(
        ActionDispatch::Session::CookieStore,
        FlashSessionCookieMiddleware,
        Rails.application.config.session_options[:key]
      )
    end
  end
end
