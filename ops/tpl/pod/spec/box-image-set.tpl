<div id="inops-podspec-imageset-form">
  <div id="inops-podspec-imageset-alert"></div>

  <table class="incp-formtable valign-middle">
    <tbody>
  
      <tr>
        <td width="200px">Image Name</td>
        <td>
          <input type="text" name="name" class="form-control" value="{[=it.image.name]}" {[? it.image.name.length > 0]}readonly{[?]}>
        </td>
      </tr>
 
      <tr>
        <td>Image Tag</td>
        <td>
          <input type="text" name="tag" class="form-control" value="{[=it.image.tag]}" {[? it.image.tag.length > 0]}readonly{[?]}>
        </td>
      </tr>

      <tr>
        <td>Driver</td>
        <td>
          <input name="driver" class="form-control" value="{[=it.image.driver]}">
        </td>
      </tr>

      <tr>
        <td>Display Name</td>
        <td>
          <input name="meta_name" class="form-control" value="{[=it.image.meta.name]}">
        </td>
      </tr>
	
      <tr>
        <td>Sort Order (0 ~ 20)</td>
        <td>
          <input name="sort_order" class="form-control" value="{[=it.image.sort_order]}">
        </td>
      </tr>

      <tr>
        <td>Action</td>
        <td>
          {[~it.actions :v]}
          <span class="ids-form-checkbox">
            <input type="radio" name="action" value="{[=v.action]}" {[ if (v.action == it.image.action) { ]}checked="checked"{[ } ]}> {[=v.title]}
          </span>
          {[~]}
        </td>
      </tr>

    </tbody>
  </table>
</div>

