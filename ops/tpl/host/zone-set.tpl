<style>
#inops-host-zone-form .btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  line-height: 120%;
}
#inops-host-zone-form button.icon-x20 {
  padding: 0px;
  width: 22px;
  height: 22px;
  font-size: 11px;
  text-align: center;
}
#inops-host-zone-form th {
  font-weight: normal;
}
#inops-host-zone-form .card-body {
  padding: 0 10px;
}

</style>

<div id="inops-host-zone-form">

  <div id="inops-host-zoneset-alert"></div>

  <table class="incp-formtable valign-middle">
    <tbody id="inops-host-zoneset">
    </tbody>
  </table>
</div>

<script id="inops-host-zoneset-tpl" type="text/html">
<tr>
  <td width="200px">Zone ID <span class="text-danger">*</span></td>
  <td width="30px"></td>
  <td>
    <input type="text" name="id" class="form-control" value="{[=it.meta.id]}" {[? it.meta.id.length > 0]}readonly{[?]}>
  </td>
</tr>

<tr>
  <td>Name <span class="text-danger">*</span></td>
  <td></td>
  <td>
    <input type="text" name="name" class="form-control" value="{[? it.meta.name]}{[=it.meta.name]}{[?]}">
  </td>
</tr>

<tr>
  <td>Driver <span class="text-danger">*</span></td>
  <td></td>
  <td>
    <select id="driver-name" class="form-control form-control-sm" name="driver_name">
    {[~it._driver_spec_list :v]}
      <option value="{[=v.name]}" {[? it.driver.name == v.name]}selected{[?]}>{[=v.name]}</option>
    {[~]}
    </select>
    <div id="zone-driver-config"></div>
  </td>
</tr>

<tr>
  <td>Description</td>
  <td></td>
  <td>
    <input type="text" name="summary" class="form-control" placeholder="Enter the Zone Summary" value="{[=it.summary]}">
  </td>
</tr>

<tr>
  <td>
    LAN Address <span class="text-danger">*</span>
  </td>
  <td>
    <button class="btn btn-default icon-x20"
      onclick="inOpsHost.ZoneLanAddressAppend()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <table width="100%">
      <tbody id="inops-host-zoneset-lanaddrs">
        {[~it.lan_addrs :vaddr]}
        <tr class="inops-host-zoneset-lanaddr-item">
          <td><input name="lan_addr" type="text" value="{[=vaddr]}" class="form-control form-control-sm"/></td>
          <td align="right" width="30px">
            <button class="btn btn-default icon-x20" onclick="inOpsHost.ZoneLanAddressDel(this)">
              <i class="fa fa-times"></i>
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
    <small class="form-text text-muted">ex: 192.168.1.1:9529</small>
  </td>
</tr>

<tr>
  <td>
    WAN Address
  </td>
  <td>
    <button class="btn btn-default icon-x20"
      onclick="inOpsHost.ZoneWanAddressAppend()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <table width="100%">
      <tbody id="inops-host-zoneset-wanaddrs">
        {[~it.wan_addrs :vaddr]}
        <tr class="inops-host-zoneset-wanaddr-item">
          <td><input name="wan_addr" type="text" value="{[=vaddr]}" class="form-control form-control-sm "/></td>
          <td align="right" width="30px">
            <button class="btn btn-default icon-x20" onclick="inOpsHost.ZoneWanAddressDel(this)">
              <i class="fa fa-times"></i>
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
    <small class="form-text text-muted">ex: 1.2.3.4:9529</small>
  </td>
</tr>

<tr>
  <td>
    Virtual Private Cloud
  </td>
  <td>
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
            <input type="text" name="network_vpc_instance" class="form-control form-control-sm" value="{[=it.network_vpc_instance]}">
            <small class="form-text text-muted">ex: 10.10.0.0/16</small>
          </td>
          <td>
            <input type="text" name="network_vpc_bridge" class="form-control form-control-sm" value="{[=it.network_vpc_bridge]}">
            <small class="form-text text-muted">ex: 192.168.10.1/24</small>
          </td>
        </tr>
      </tbody>
    </table>
    <small class="form-text text-muted">notice: avoid conflicts with the IP range of the host's physical network</small>
  </td>
</tr>

<tr>
  <td>Private Domain Name</td>
  <td></td>
  <td>
    <input type="text" name="network_domain_name" class="form-control form-control-sm" placeholder="Enter the Domain Name" value="{[=it.network_domain_name]}">
    <small class="form-text text-muted">ex: zone-service.example.com</small>
  </td>
</tr>

{[? inCp.syscfg.zone_master.multi_zone_enable]}
<tr>
  <td>Cross Region Zone access API</td>
  <td></td>
  <td>
    <input type="text" name="wan_api" class="form-control form-control-sm" placeholder="Enter the Zone API" value="{[=it.wan_api]}">
    <small class="form-text text-muted">ex: http://1.2.3.4:9529 or https://example.com</small>
  </td>
</tr>
{[?]}

<tr>
  <td>
    Image Registry Services
  </td>
  <td>
    <button class="btn btn-default icon-x20"
      onclick="inOpsHost.ZoneImageServiceAppend()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <table width="100%">
      <thead>
        <tr>
          <th width="30%">Driver</th>
          <th>URL</th>
          <th width="30px"></th>
        </tr>
      </thead>
      <tbody id="inops-host-zoneset-imageservice">
        {[~it.image_services :v]}
        <tr class="inops-host-zoneset-imageservice-item">
          <td><input name="image_service_driver" type="text" value="{[=v.driver]}" class="form-control form-control-sm"/></td>
          <td>
            <input name="image_service_url" type="text" value="{[=v.url]}" class="form-control form-control-sm"/>
          </td>
          <td align="right" width="30px">
            <button class="btn btn-default icon-x20" onclick="inOpsHost.ZoneImageServiceDel(this)">
              <i class="fa fa-times"></i>
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
      <tbody>
        <tr>
          <td>
            <small class="form-text text-muted">ex: docker, or pouch</small>
          </td>
          <td>
            <small class="form-text text-muted">ex: https://registry.docker.com</small>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>

<tr>
  <td>Groups  <span class="text-danger">*</span></td>
  <td>
    <button class="btn btn-default icon-x20"
      onclick="inOpsHost.ZoneGroupAppend()">
      <i class="fa fa-plus"></i>
    </button>
  </td>
  <td>
    <table width="100%">
      <thead>
        <tr>
          <th width="10%">ID</th>
          <th width="20%">Name</th>
          <th>Description</th>
          <th width="30px"></th>
        </tr>
      </thead>
      <tbody id="inops-host-zoneset-groups">
      </tbody>
    </table>
  </td>
</tr>


<tr>
  <td>Action <span class="text-danger">*</span></td>
  <td></td>
  <td>
    {[~it._actions :v]}
    <span class="ids-form-checkbox">
      <input type="radio" name="phase" value="{[=v.action]}" {[ if (v.action == it.phase) { ]}checked="checked"{[ } ]}> {[=v.title]}
    </span>
    {[~]}
  </td>
</tr>
</script>

<script id="inops-host-zoneset-wanaddr-tpl" type="text/html">
<tr class="inops-host-zoneset-wanaddr-item">
  <td><input name="wan_addr" type="text" value="" class="form-control form-control-sm"/></td>
  <td align="right" width="30px">
    <button class="btn btn-default icon-x20" onclick="inOpsHost.ZoneWanAddressDel(this)">
    <i class="fa fa-times"></i>
  </td>
</tr>
</script>

<script id="inops-host-zoneset-lanaddr-tpl" type="text/html">
<tr class="inops-host-zoneset-lanaddr-item">
  <td><input name="lan_addr" type="text" value="" class="form-control form-control-sm"/></td>
  <td align="right" width="30px">
    <button class="btn btn-default icon-x20" onclick="inOpsHost.ZoneLanAddressDel(this)">
    <i class="fa fa-times"></i>
  </td>
</tr>
</script>

<script id="inops-host-zoneset-imageservice-tpl" type="text/html">
<tr class="inops-host-zoneset-imageservice-item">
  <td width="200px"><input name="image_service_driver" type="text" value="" class="form-control form-control-sm"/></td>
  <td><input name="image_service_url" type="text" value="" class="form-control form-control-sm"/></td>
  <td align="right" width="30px">
    <button class="btn btn-default icon-x20" onclick="inOpsHost.ZoneImageServiceDel(this)">
    <i class="fa fa-times"></i>
  </td>
</tr>
</script>

<script id="inops-host-zoneset-group-tpl" type="text/html">
<tr class="inops-host-zoneset-group-item">
  <td><input name="id" type="text" value="{[? it.id]}{[=it.id]}{[?]}" class="form-control form-control-sm"/></td>
  <td><input name="name" type="text" value="{[? it.name]}{[=it.name]}{[?]}" class="form-control form-control-sm"/></td>
  <td><input name="description" type="text" value="{[? it.description]}{[=it.description]}{[?]}" class="form-control form-control-sm"/></td>
  <td align="right">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" name="action" value="1" {[? it.action == inOpsHost.ZoneGroupSetupIn]}checked{[?]}>
    </div>
  </td>
</tr>
</script>

