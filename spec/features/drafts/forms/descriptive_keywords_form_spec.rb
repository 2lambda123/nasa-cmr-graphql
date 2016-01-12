# MMT-287

require 'rails_helper'

describe 'Descriptive keywords form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Descriptive Keywords'
      end

      open_accordions

      # Science keywords
      add_science_keywords

      # Ancillary Keywords
      within '.multiple.ancillary-keywords' do
        within '.multiple-item-0' do
          find('.ancillary-keyword').set 'Ancillary keyword 1'
          click_on 'Add another Ancillary Keyword'
        end
        within '.multiple-item-1' do
          find('.ancillary-keyword').set 'Ancillary keyword 2'
        end
      end

      # Additional Attributes
      within '.multiple.additional-attributes' do
        fill_in 'Name', with: 'Attribute 1'
        fill_in 'Description', with: 'Description'
        select 'Integer', from: 'Data Type'
        fill_in 'Description', with: 'Description'
        fill_in 'Measurement Resolution', with: 'Measurement Resolution'
        fill_in 'Parameter Range Begin', with: '1'
        fill_in 'Parameter Range End', with: '5'
        fill_in 'Parameter Units Of Measure', with: 'Parameter Units Of Measure'
        fill_in 'Parameter Value Accuracy', with: 'Parameter Value Accuracy'
        fill_in 'Value Accuracy Explanation', with: 'Value Accuracy Explanation'
        fill_in 'Group', with: 'Group'
        fill_in 'Update Date', with: '2015-09-14T00:00:00Z'

        click_on 'Add another Additional Attribute'

        within '.multiple-item-1' do
          fill_in 'Name', with: 'Attribute 2'
          select 'String', from: 'Data Type'
        end
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it 'shows pre-entered values in the draft preview page' do
      # Science Keywords
      expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
      expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
      expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')

      # Ancillary Keywords
      expect(page).to have_content('Ancillary keyword 1')
      expect(page).to have_content('Ancillary keyword 2')

      # Additional Attributes
      expect(page).to have_content('Attribute 1')
      expect(page).to have_content('Description')
      expect(page).to have_content('Integer')
      expect(page).to have_content('Description')
      expect(page).to have_content('Measurement Resolution')
      expect(page).to have_content('1')
      expect(page).to have_content('5')
      expect(page).to have_content('Parameter Units Of Measure')
      expect(page).to have_content('Parameter Value Accuracy')
      expect(page).to have_content('Value Accuracy Explanation')
      expect(page).to have_content('Group')
      expect(page).to have_content('2015-09-14T00:00:00Z')
      expect(page).to have_content('Attribute 2')
      expect(page).to have_content('String')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Descriptive Keywords'
        end

        open_accordions
      end

      it 'populates the form with the values' do
        # Science keywords
        expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS')
        expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > MOBILE GEOGRAPHIC INFORMATION SYSTEMS')
        expect(page).to have_content('EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS')

        # Ancillary Keywords
        within '.multiple.ancillary-keywords' do
          expect(page).to have_selector('input.ancillary-keyword[value="Ancillary keyword 1"]')
          expect(page).to have_selector('input.ancillary-keyword[value="Ancillary keyword 2"]')
        end

        # Additional Attributes
        within '.multiple.additional-attributes' do
          within '.multiple-item-0' do
            expect(page).to have_field('Name', with: 'Attribute 1')
            expect(page).to have_field('Description', with: 'Description')
            expect(page).to have_field('Data Type', with: 'INT')
            expect(page).to have_field('Description', with: 'Description')
            expect(page).to have_field('Measurement Resolution', with: 'Measurement Resolution')
            expect(page).to have_field('Parameter Range Begin', with: '1')
            expect(page).to have_field('Parameter Range End', with: '5')
            expect(page).to have_field('Parameter Units Of Measure', with: 'Parameter Units Of Measure')
            expect(page).to have_field('Parameter Value Accuracy', with: 'Parameter Value Accuracy')
            expect(page).to have_field('Value Accuracy Explanation', with: 'Value Accuracy Explanation')
            expect(page).to have_field('Group', with: 'Group')
            expect(page).to have_field('Update Date', with: '2015-09-14T00:00:00Z')
          end

          within '.multiple-item-1' do
            expect(page).to have_field('Name', with: 'Attribute 2')
            expect(page).to have_field('Data Type', with: 'STRING')
          end
        end
      end
    end
  end
end
