<div id="inops-host-cell-form">
  <div id="inops-host-cellset-alert"></div>

  <input type="hidden" name="zone_id" value="{[=it.zone_id]}">

  <table class="incp-formtable valign-middle">
    <tbody>
  
      <tr>
        <td width="200px">Cell ID</td>
        <td>
          <input type="text" name="id" class="form-control" value="{[=it.meta.id]}" {[? it.meta.id.length > 0]}readonly{[?]}>
        </td>
      </tr>

      <tr>
        <td>Description</td>
        <td>
          <input name="description" class="form-control" value="{[=it.description]}">
        </td>
      </tr>
	
      <tr>
        <td>Action</td>
        <td>
          {[~it._actions :v]}
          <span class="ids-form-checkbox">
            <input type="radio" name="phase" value="{[=v.action]}" {[ if (v.action == it.phase) { ]}checked="checked"{[ } ]}> {[=v.title]}
          </span>
          {[~]}
        </td>
      </tr>

    </tbody>
  </table>
</div>

