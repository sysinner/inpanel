<div id="inops-host-zone-entry-index">
  <div id="inops-host-zone-entry-overview"></div>
  <div id="inops-host-zone-entry-node-list" style="margin-top:20px"></div>
</div>


<script type="text/html" id="inops-cluster-zone-entry-menu">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inOpsHost.ZoneList()">
    <span class="fa fa-chevron-circle-left"></span>
    Back
  </a>
</li>
</script>

<script type="text/html" id="inops-cluster-zone-entry-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inOpsHost.ZoneSet()">
    <span class="fa fa-cog"></span>
    Setting
  </a>
</li>
</script>

<script type="text/html" id="inops-host-zone-entry-overview-info-tpl">

<!-- frame-inline/ -->
<div class="incp-card-frame-row incp-card-frame-inline">

  <div class="incp-card-frame incp-card-frame-p60">
    <div class="incp-div-light">
      <div class="incp-card-title">
        <span>Information</span>
      </div>
      <div class="incp-card-body">
        <div class="incp-card-frame-inline">
          <div class="incp-card-frame incp-card-frame-p33 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name">
                Zone ID
                <span class="incp-btn-hover" onclick="inCp.CopyToClipboard('inops-host-zone-entry-zone-id')"
                  title="Copy to Clipboard">
                  <span class="fas fa-clone"></span>
                </span>
              </div>
            </div>
            <div class="table-row">
              <div class="value" id="inops-host-zone-entry-zone-id">{[=it.meta.id]}</div>
            </div>
          </div>
          <div class="incp-card-frame incp-card-frame-p33 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name">Name</div>
            </div>
            <div class="table-row">
              <div class="value">{[=it.meta.name]}</div>
            </div>
          </div>
          <div class="incp-card-frame incp-card-frame-p33 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name">Driver</div>
            </div>
            <div class="table-row">
              <div class="value">{[=it.driver.name]}</div>
            </div>
          </div>
        </div>
        <div class="incp-card-frame-inline">
          <div class="incp-card-frame incp-card-frame-p33 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name">Action</div>
            </div>
            <div class="table-row">
              <div class="value">{[=inOpsHost.ActionTitle(it.phase)]}</div>
            </div>
          </div>
          <div class="incp-card-frame incp-card-frame-p33 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name"></div>
            </div>
            <div class="table-row">
              <div class="value" id="inops-host-zone-entry-payment-amount"></div>
            </div>
          </div>
          <div class="incp-card-frame incp-card-frame-p33 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name"></div>
            </div>
            <div class="table-row">
              <div class="value incp-font-ok" id="inops-host-zone-entry-status-value"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>


  <div class="incp-card-frame incp-card-frame-p40">
    <div class="incp-div-light">
      <div class="incp-card-title">
        <span>Network</span>
      </div>
      <div class="incp-card-body">
        <div class="incp-card-frame-inline">
          <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name">LAN Address</div>
            </div>
            <div class="table-row">
              <div class="value">{[=it.lan_addrs.join(", ")]}</div>
            </div>
          </div>
          <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name">WAN Address</div>
            </div>
            <div class="table-row">
              <div class="value">{[? it.wan_addrs.length]}{[=it.wan_addrs.join(", ")]}{[??]}--{[?]}</div>
            </div>
          </div>
        </div>
        <div class="incp-card-frame-inline">
          <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name">VPC IP for Container</div>
            </div>
            <div class="table-row">
              <div class="value">{[? it.network_vpc_instance == ""]}--{[??]}{[=it.network_vpc_instance]}{[?]}</div>
            </div>
          </div>
          <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
            <div class="table-row">
              <div class="name">VPC IP for Bridge</div>
            </div>
            <div class="table-row">
              <div class="value">{[? it.network_vpc_bridge == ""]}--{[??]}{[=it.network_vpc_bridge]}{[?]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
<!-- /frame-inline -->

</script>


<script id="inops-host-zone-entry-node-list-tpl" type="text/html">

  <div class="incp-card-frame-row">
    <div class="incp-card-frame incp-card-frame-p00">

      <div class="incp-div-light">
        <div class="incp-card-title">
          <span>Nodes</span>
		  <span>
          <span class="incp-card-title-rbar incp-btn-hover btn btn-sm btn-outline-dark" onclick="inOpsHost.ZoneNodeListSyncPull()">
            <span class="fa fa-plus-circle"></span>
			Create
          </span>
          <span class="incp-card-title-rbar incp-btn-hover btn btn-sm btn-outline-dark" onclick="inOpsHost.ZoneNodeListSyncPull()">
            <span class="fa fa-cloud-download-alt"></span>
			Refresh
          </span>
		  </span>
        </div>
        <div class="incp-card-body incp-formtable">

          {[? it.items && it.items.length > 0]}
          <table class="valign-middle incp-formtable-space-x0050">
            <thead>
              <tr class="incp-formtable-row-line">
                <th>Name / ID</th>
                {[? it._zone && it._zone.driver && it._zone.driver.name != "private_cloud"]}<th>Cloud Provider<br/>Name / ID</th>{[?]}
                <th>Network</th>
                <th>Allocated<br />CPU - RAM</th>
                <th>Priority</th>
                <th>Action</th>
                <th>Ports</th>
                <th>Pods</th>
                <th style="min-width:100px"></th>
              </tr>
            </thead>
            <tbody id="">

              {[~it.items :v]}
              <tr class="incp-formtable-tr-line">
                <td class="incp-font-fixspace">
                  {[=v.meta.name]}<br />
                  <span class="incp-font-fixspace">{[=v.meta.id]}</span>
                </td>
                {[? it._zone && it._zone.driver && it._zone.driver.name != "private_cloud"]}
                <td class="incp-font-fixspace">
                  {[? v.cloud_provider]}
                    {[=v.cloud_provider.instance_name]}<br />
                    <span class="incp-font-fixspace">{[=v.cloud_provider.instance_id]}</span>
                  {[?]}
                </td>
                {[?]}
                <td class="incp-ctn-hover" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">
                  {[=v.spec.peer_lan_addr]}
                  {[? v.spec.peer_wan_addr]}<br/>{[=v.spec.peer_wan_addr]}{[?]}
                </td>
                <td class="incp-ctn-hover" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">
                  {[=(v.operate.cpu_used/10).toFixed(1)]} / {[=v.spec.capacity.cpu/10]}<br />
                  {[=inCp.UtilResSizeFormat(v.operate.mem_used * inCp.ByteMB)]} /
                  {[=inCp.UtilResSizeFormat(v.spec.capacity.mem * inCp.ByteMB)]}
                </td>
                <td class="incp-ctn-hover" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">
                  {[=v.operate.pr]}
                </td>
                <td class="incp-ctn-hover" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">
                  {[=inCp.HtmlVarDisplay(v._action_display)]}{[=inCp.HtmlVarDisplay(v._status, "/")]}
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary"
                    onclick="inOpsHost.NodeOpPortUsedInfo(null, null, '{[=v.meta.id]}')" style="width:40px">
                    {[=v.operate.port_used.length]}
                  </button>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary"
                    onclick="inOpsHost.NodePodList(null, null, '{[=v.meta.id]}')" style="width:40px">
                    {[=v.operate.box_num]}
                  </button>
                </td>
                <td align="right">
                  <button class="btn btn-sm btn-outline-primary"
                    onclick="inOpsHost.NodeSet(null, null, '{[=v.meta.id]}')" style="width:60px">
                    <span class="fa fa-cog"></span>
                  </button>
                  <button class="btn btn-sm btn-outline-primary" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')"
                    style="width:60px">
                    <span class="fa fa-chevron-right"></span>
                  </button>
                </td>
              </tr>
              {[~]}

            </tbody>
          </table>
          {[??]}
		    <div>no items found ...</div>
          {[?]}

        </div>
      </div>
    </div>
  </div>
</script>
