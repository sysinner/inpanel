<div id="inops-host-node-form">
 
  <div id="inops-host-nodenew-alert"></div>

  <input type="hidden" name="operate_zone_id" value="{[=it.operate.zone_id]}">
  <input type="hidden" name="operate_cell_id" value="{[=it.operate.cell_id]}">

  <table class="incp-formtable valign-middle">
    <tbody>
 
      <tr>
        <td width="300px">Name</td>
        <td>
          <input type="text" name="name" class="form-control" placeholder="Enter the Node Name" value="">
        </td>
      </tr>

      <tr>
        <td>Peer Address</td>
        <td>
          <input type="text" name="peer_lan_addr" class="form-control" placeholder="Enter the Address" value="">
          <small class="form-text text-muted">example: 192.168.1.1:9529</small>
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
        <td>Secret Key</td>
        <td>
          <input type="text" name="secret_key" class="form-control" placeholder="Enter the Node Access Secret Key" value="">
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
