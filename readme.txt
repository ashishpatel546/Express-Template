Type this to show error message

<% if(errorMessage){ %>
            <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
              <strong></strong> <%= errorMessage %>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <% } %>