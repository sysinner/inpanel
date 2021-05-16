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

      {[? it.operate._network_vpc_enable]}
      <tr>
        <td>
          Virtual Private Cloud
        </td>
        <td>
          <table width="100%">
            <thead>
              <tr>
                <th width="50%">IP range for Container</th>
                <th>IP range for Bridge device of Host</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" name="operate_network_vpc_instance" class="form-control form-control-sm" value="{[=it.operate.network_vpc_instance]}">
                  <small class="form-text text-muted">ex: 10.10.1.0/24</small>
                </td>
                <td>
                  <input type="text" name="operate_network_vpc_bridge" class="form-control form-control-sm" value="{[=it.operate.network_vpc_bridge]}">
                  <small class="form-text text-muted">ex: 192.168.10.1</small>
                </td>
              </tr>
            </tbody>
          </table>
          <small class="form-text text-muted">notice: avoid conflicts with the IP range of the host's physical network</small>
        </td>
      </tr>
      {[?]}

      <tr>
        <td>Action <span class="text-danger">*</span></td>
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

