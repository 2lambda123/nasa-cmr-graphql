module Cmr
  class DmmtClient < BaseClient
    def dmmt_get_approved_proposals(params, token, request)
      url = if Rails.env.development?
              "http://localhost:3000/approved_proposals"
            elsif Rails.env.test?
              "http://#{request.ip}:#{request.port}/approved_proposals"
            else
              '/approved_proposals'
            end


      headers = {
        'Content-Type' => 'application/json'
      }

      get(url, params, headers.merge(token_header(token, true)))
    end
  end
end