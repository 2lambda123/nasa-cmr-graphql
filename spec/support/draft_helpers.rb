module Helpers
  module DraftHelpers

    def output_schema_validation(draft)
      schema = 'lib/assets/schemas/umm-c-json-schema.json'
      JSON::Validator.fully_validate(schema, draft).each do |error|
        puts error
      end
    end

    def create_new_draft
      visit '/dashboard'
      choose 'New Collection Record'
      click_on 'Create Record'
    end

    def open_accordions
      script = "$('.accordion.is-closed').removeClass('is-closed');"
      page.evaluate_script script
    end

    MismatchedKeys = [
      "DataDates",
      "MetadataDates",
      "ResponsibleOrganizations",
      "ResponsiblePersonnel",
      "CollectionCitations"
    ]

    def check_css_path_for_display_of_values(rendered, draft, key, path, special_handling = {}, top_level = false)
      path += " > li.#{name_to_class(key)}" if top_level

      case draft
      when NilClass
        # Don't expect any values
      when String, Fixnum, FalseClass, TrueClass
        new_path = path

        parent_key_special_handling = special_handling[key.to_sym]
        if parent_key_special_handling == :handle_as_currency && draft =~ /\A[-+]?\d*\.?\d+\z/
          draft = number_to_currency(draft.to_f)
        elsif parent_key_special_handling == :handle_as_role
          # Map role value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::RoleOptions)
        elsif parent_key_special_handling == :handle_as_duration
          # Map duration value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::DurationOptions)
        elsif parent_key_special_handling == :handle_as_collection_data_type
          # Map duration value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::CollectionDataTypeOptions)
        elsif parent_key_special_handling == :handle_as_date_type
          # Map date type value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::DateTypeOptions)
        elsif parent_key_special_handling == :handle_as_collection_progress
          # Map duration value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::CollectionProgressOptions)
        elsif parent_key_special_handling == :handle_as_granule_spatial_representation
          # Map value stored in json to what is actually supposed to be displayed
          draft = map_value_onto_display_string(draft, DraftsHelper::GranuleSpatialRepresentationOptions)
        elsif parent_key_special_handling == :handle_as_not_shown
          # This field is present in json, but intentionally not displayed
          return
        end

        expect(rendered.find(:css, new_path)).to have_content(draft)

      when Hash
        top_path = ''
        if top_level
          top_path = " > ul"
        end
        draft.each do |new_key, value|
          new_path = path + top_path

          new_path += " > li.#{name_to_class(new_key)}"
          if "TypesHelper::#{new_key}Type".safe_constantize
            new_path += " > ul" unless key == "DOI" || new_key == 'Date'
          end
          check_css_path_for_display_of_values(rendered, value, new_key, new_path, special_handling)
        end

      when Array
        draft.each_with_index do |value, index|
          new_path = path

          class_name = "#{name_to_class(key)}-#{index}"
          if "TypesHelper::#{key}Type".safe_constantize
            new_path += "#{' > ul' if top_level}.#{class_name}"
          elsif MismatchedKeys.include?(key)
            new_path += " > ul.#{class_name}"
          else
            new_path += " > ul > li.#{class_name}"
          end

          check_css_path_for_display_of_values(rendered, value, class_name, new_path, special_handling)
        end
      end

    end

    def add_organization
      fill_in 'Short Name', with: 'ORG_SHORT'
      fill_in 'Long Name', with: 'Organization Long Name'
    end

    def add_person
      fill_in 'First Name', with: 'First Name'
      fill_in 'Middle Name', with: 'Middle Name'
      fill_in 'Last Name', with: 'Last Name'
    end

    def add_responsibilities(type=nil)
      within '.multiple.responsibilities' do
        select 'Resource Provider', from: 'Role'
        case type
        when 'organization'
          add_organization
        when 'personnel'
          add_person
        else
          find(".responsibility-picker.organization").click
          add_organization
        end

        fill_in 'Service Hours', with: '9-5, M-F'
        fill_in 'Contact Instructions', with: 'Email only'

        add_contacts
        add_addresses
        add_related_urls

        click_on "Add another #{(type || 'responsibility').titleize}"
        within '.multiple-item-1' do
          select 'Owner', from: 'Role'
          case type
          when 'organization'
            add_organization
          when 'personnel'
            add_person
          else
            find(".responsibility-picker.person").click
            add_person
          end

          fill_in 'Service Hours', with: '10-2, M-W'
          fill_in 'Contact Instructions', with: 'Email only'

          add_contacts
          add_addresses
          add_related_urls
        end
      end
    end

    def add_dates(prefix = nil)
      within ".multiple.dates" do
        select 'Create', from: 'Type'
        fill_in 'Date', with: '2015-07-01T00:00:00Z'

        click_on 'Add another Date'
        within '.multiple-item-1' do
          select 'Review', from: 'Type'
          fill_in 'Date', with: '2015-07-02T00:00:00Z'
        end

      end
    end

    def add_contacts
      within '.multiple.contacts' do
        fill_in 'Type', with: 'Email'
        fill_in 'Value', with: 'example@example.com'
        click_on 'Add another Contact'
        within '.multiple-item-1' do
          fill_in 'Type', with: 'Email'
          fill_in 'Value', with: 'example2@example.com'
        end
      end
    end

    def add_addresses
      within '.multiple.addresses' do
        within '.multiple.addresses-street-addresses' do
          within first('.multiple-item') do
            find('input').set '300 E Street Southwest'
          end
          within all('.multiple-item').last do
            find('input').set 'Room 203'
          end
        end
        fill_in 'City', with: 'Washington'
        fill_in 'State / Province', with: 'DC'
        fill_in 'Postal Code', with: '20546'
        fill_in 'Country', with: 'United States'
        click_on 'Add another Address'
        within '.multiple-item-1' do
          within '.multiple.addresses-street-addresses' do
            within first('.multiple-item') do
              find('input').set '8800 Greenbelt Road'
            end
          end
          fill_in 'City', with: 'Greenbelt'
          fill_in 'State / Province', with: 'MD'
          fill_in 'Postal Code', with: '20771'
          fill_in 'Country', with: 'United States'
        end
      end
    end

    def add_related_urls(single=nil)
      within "#{'.multiple' unless single}.related-url#{'s' unless single}" do
        within '.multiple.related-url-url' do
          fill_in 'URL', with: 'http://example.com'
          click_on 'Add another'
          within all('.multiple-item').last do
            fill_in 'URL', with: 'http://another-example.com'
          end
        end
        fill_in 'Description', with: 'Example Description'
        select 'FTP', from: 'Protocol'
        fill_in 'Mime Type', with: 'text/html'
        fill_in 'Caption', with: 'Example Caption'
        fill_in 'Title', with: 'Example Title'
        within '.file-size' do
          fill_in 'Size', with: '42'
          fill_in 'Unit', with: 'MB'
        end
        within '.content-type' do
          fill_in 'Type', with: 'Type'
          fill_in 'Subtype', with: 'Subtype'
        end

        unless single
          # Add another RelatedUrl
          click_on 'Add another Related Url'

          within '.multiple-item-1' do
            within '.multiple.related-url-url' do
              fill_in 'URL', with: 'http://example.com/1'
            end
          end
        end
      end
    end

    def add_resource_citation
      within '.multiple.resource-citations' do
        fill_in 'Version', with: 'v1'
        fill_in "draft_collection_citations_0_title", with: "Citation title" #Title
        fill_in 'Creator', with: 'Citation creator'
        fill_in 'Editor', with: 'Citation editor'
        fill_in 'Series Name', with: 'Citation series name'
        fill_in 'Release Date', with: '2015-07-01T00:00:00Z'
        fill_in 'Release Place', with: 'Citation release place'
        fill_in 'Publisher', with: 'Citation publisher'
        fill_in 'Issue Identification', with: 'Citation issue identification'
        fill_in 'Data Presentation Form', with: 'Citation data presentation form'
        fill_in 'Other Citation Details', with: 'Citation other details'
        fill_in 'DOI', with: 'Citation DOI'
        fill_in 'Authority', with: 'Citation DOI Authority'
        add_related_urls(true)

        click_on 'Add another Resource Citation'
        within '.multiple-item-1' do
          fill_in 'Version', with: 'v2'
          fill_in "draft_collection_citations_1_title", with: "Citation title 1" #Title
          fill_in 'Creator', with: 'Citation creator 1'
          add_related_urls(true)
        end

      end
    end

    def add_metadata_association
      within '.multiple.metadata-associations' do
        select 'Science Associated', from: 'Type'
        fill_in 'Description', with: 'Metadata association description'
        fill_in 'Entry Id', with: '12345'
        select 'LPDAAC_ECS', from: 'Provider ID'
        click_on 'Add another Metadata Association'
        within '.multiple-item-1' do
          select 'Larger Citation Works', from: 'Type'
          fill_in 'Entry Id', with: '123abc'
          select 'ORNL_DAAC', from: 'Provider ID'
        end
      end
    end

    def add_publication_reference
      within '.multiple.publication-references' do
        fill_in "draft_publication_references_0_title", with: "Publication reference title" #Title
        fill_in 'Publisher', with: 'Publication reference publisher'
        fill_in 'DOI', with: 'Publication reference DOI'
        fill_in 'Authority', with: 'Publication reference authority'
        fill_in 'Author', with: 'Publication reference author'
        fill_in 'Publication Date', with: '2015-07-01T00:00:00Z'
        fill_in 'Series', with: 'Publication reference series'
        fill_in 'Edition', with: 'Publication reference edition'
        fill_in 'Volume', with: 'Publication reference volume'
        fill_in 'Issue', with: 'Publication reference issue'
        fill_in 'Report Number', with: 'Publication reference report number'
        fill_in 'Publication Place', with: 'Publication reference publication place'
        fill_in 'Pages', with: 'Publication reference pages'
        fill_in 'ISBN', with: '1234567890123'
        fill_in 'Other Reference Details', with: 'Publication reference details'
        add_related_urls(true)

        click_on 'Add another Publication Reference'
        within '.multiple-item-1' do
          fill_in "draft_publication_references_1_title", with: "Publication reference title 1" #Title
          fill_in 'ISBN', with: '9876543210987'
        end
      end
    end

    def add_platforms
      within '.multiple.platforms' do
        fill_in 'Type', with: 'Platform type'
        fill_in "draft_platforms_0_short_name", with: 'Platform short name'
        fill_in "draft_platforms_0_long_name", with: 'Platform long name'
        add_characteristics
        add_instruments

        click_on 'Add another Platform'
        within '.multiple-item-1' do
          fill_in "draft_platforms_1_short_name", with: 'Platform short name 1'
          add_instruments('1')
        end
      end
    end

    def add_characteristics
      within first('.multiple.characteristics') do
        fill_in 'Name', with: 'Characteristics name'
        fill_in 'Description', with: 'Characteristics description'
        fill_in 'Value', with: 'Characteristics value'
        fill_in 'Unit', with: 'unit'
        fill_in 'Data Type', with: 'Characteristics data type'

        click_on 'Add another Characteristic'
        within '.multiple-item-1' do
          fill_in 'Name', with: 'Characteristics name 1'
          fill_in 'Description', with: 'Characteristics description 1'
          fill_in 'Value', with: 'Characteristics value 1'
          fill_in 'Unit', with: 'unit 1'
          fill_in 'Data Type', with: 'Characteristics data type 1'
        end
      end
    end

    def add_instruments(platform='0')
      within '.multiple.instruments' do
        fill_in "draft_platforms_#{platform}_instruments_0_short_name", with: 'Instrument short name'
        fill_in "draft_platforms_#{platform}_instruments_0_long_name", with: 'Instrument long name'
        fill_in "draft_platforms_#{platform}_instruments_0_technique", with: 'Instrument technique'
        fill_in 'Number Of Sensors', with: 2468
        within '.multiple.operational-mode' do
          fill_in 'Operational Mode', with: 'Instrument mode'
          click_on 'Add another'
          within all('.multiple-item').last do
            fill_in 'Operational Mode', with: 'Instrument mode 1'
          end
        end

        add_characteristics
        add_sensors(platform)

        click_on 'Add another Instrument'
        within '.multiple-item-1' do
          fill_in "draft_platforms_#{platform}_instruments_1_short_name", with: 'Instrument short name 1'
        end
      end
    end

    def add_sensors(platform)
      within '.multiple.sensors' do
        fill_in "draft_platforms_#{platform}_instruments_0_sensors_0_short_name", with: 'Sensor short name'
        fill_in "draft_platforms_#{platform}_instruments_0_sensors_0_long_name", with: 'Sensor long name'
        fill_in "draft_platforms_#{platform}_instruments_0_sensors_0_technique", with: 'Sensor technique'
        add_characteristics

        click_on 'Add another Sensor'
        within '.multiple-item-1' do
          fill_in "draft_platforms_#{platform}_instruments_0_sensors_1_short_name", with: 'Sensor short name 1'
        end
      end
    end

  end
end
