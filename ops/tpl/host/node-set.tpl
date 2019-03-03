<div id="inops-host-node-form">
  <div id="inops-host-nodeset-alert"></div>

  <input type="hidden" name="id" value="{[=it.meta.id]}">
  <input type="hidden" name="operate_zone_id" value="{[=it.operate.zone_id]}">
  <input type="hidden" name="operate_cell_id" value="{[=it.operate.cell_id]}">

  <table class="incp-formtable valign-middle">
    <tbody>
 
      <tr>
        <td width="300px">Name</td>
        <td>
          <input type="text" name="name" class="form-control" placeholder="Enter the Node Name" value="{[=it.meta.name]}">
        </td>
      </tr>

      <tr>
        <td>Priority of resource allocation</td>
        <td>
		  <select class="form-control" name="operate_pr">
          {[~it._priorities :v]}
            <option value="{[=v.pr]}" {[? it.operate.pr == v.pr]}selected{[?]}>{[=v.name]}</option>
          {[~]}
		  </select>
        </td>
      </tr>
 
      <tr>
        <td>Action</td>
        <td>
          {[~it._actions :v]}
          <span class="ids-form-checkbox">
            <input type="radio" name="operate_action" value="{[=v.action]}" {[ if (v.action == it.operate.action) { ]}checked="checked"{[ } ]}> {[=v.title]}
          </span>
          {[~]}
        </td>
      </tr>


    </tbody>
  </table>
</div>

